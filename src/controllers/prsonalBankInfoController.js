const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const { sendOtp } = require('../services/twilioConfig'); // Create twilioConfig.js and implement sendOtp function
const crypto = require('crypto');
const Otp = require('../models/otp');
const UserAmount = require('../models/userAmount');
const UserInfo = require('../models/userInfo');
const bcrypt = require('bcrypt');
const { isSet } = require('util/types');
const saltRounds = 10; // Number of salt rounds for bcrypt


const addInfo = async (req, res) => {
    try {
        const { user_id, actual_name, ifsc_code, account_number, bank_name, state, city, address, mobile_no, email, upi_id, OTP } = req.body;

        // Validate request data
        if (!user_id || !actual_name || !ifsc_code || !account_number || !bank_name || !mobile_no || !email || !upi_id || !OTP) {
            throw new ValidationError('UserId, IFSC Code , Account Number, Bank Name , MobileNumber , Email , UPIID And OTP are required');
        }
        const userExists = await User.fetchUserByUserId(user_id);
        const activeOtp = await Otp.findOne({
            number: userExists.phoneNumber,
            otp: OTP,
            status: 'active',
            deleted: false,
            expirationTime: { $gt: new Date() },
        });

        if (activeOtp) {
            var iCheckAlreadyPresent = await UserInfo.fetchRecordByUserId(user_id);

            if (iCheckAlreadyPresent) {
                var invalidDataResult = await UserInfo.deleteRecordByUserId(user_id);
            }
            var oUserInfo = await UserInfo.insertRecord({
                user_id, actual_name, ifsc_code, account_number, bank_name, mobile_no, email, upi_id, state, city, address
            });

            // Respond with a success message
            res.status(201).json({ status: 200, message: 'User Info Added successfully', body: oUserInfo });
        } else {
            throw new ValidationError('Please enter a valid otp');
        }

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};

const getAllInfo = async (req, res) => {
    try {
        var oUserInfo = await UserInfo.fetchAllRecords();

        // Respond with a success message
        res.status(201).json({ status: 200, message: 'successfully', body: oUserInfo });

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const getInfoByUserId = async (req, res) => {

    try {
        const { userId } = req.params;
        var oUserInfo = await UserInfo.fetchRecordByUserId(userId);

        if (!oUserInfo) {
            res.status(200).json({ status: 404, error: 'User Not found' });
        } else {
            // Respond with a success message
            res.status(200).json({ status: 200, message: 'successfully', body: oUserInfo });
        }



    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};

const invalidUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        var oUserInfo = await UserInfo.deleteRecordByUserId(userId);

        if (!oUserInfo) {
            res.status(500).json({ status: 500, error: 'User Not found' });
        } else {
            // Respond with a success message
            res.status(201).json({ status: 200, message: 'Deleted successfully', body: oUserInfo });
        }

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const updateUserInfo = async (req, res) => {

    try {
        const { _id, actual_name, ifsc_code, account_number, bank_name, state, city, address, mobile_no, email, upi_id } = req.body;
        var oUserInfo = await UserInfo.updateRecord(_id, {
            actual_name, ifsc_code, account_number, bank_name, mobile_no, email, upi_id
        });

        if (!oUserInfo) {
            res.status(500).json({ status: 500, error: 'User Not found' });
        } else {
            // Respond with a success message
            res.status(201).json({ status: 200, message: 'successfully', body: oUserInfo });
        }

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}


const genrateBankOTP = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: 'Missing User ID parameter' });
        }

        // Check if the phone number exists in the user table
        const userExists = await User.fetchUserByUserId(user_id);

        if (userExists != null) {
            // Check if an active OTP already exists for the phone number
            const activeOtp = await Otp.findOne({
                number: userExists.phoneNumber,
                status: 'active',
                deleted: false,
                expirationTime: { $gt: new Date() }, // Check if expirationTime is greater than the current time
            });

            if (activeOtp) {
                // If an active OTP exists, inform the user that OTP has already been sent
                return res.status(200).json({ 'status': 200, message: 'OTP already sent. Please check your messages.' });
            }

            // Generate a 6-digit OTP
            const otp = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);

            // Send OTP via SMS (implement this function in twilioConfig.js)
            const isOtpSent = await sendOtp(userExists.phoneNumber, otp);

            // Save OTP to the OTP model
            const otpData = new Otp({
                number: userExists.phoneNumber,
                otp: otp,
                status: 'active',
                deleted: false,
                expirationTime: new Date(Date.now() + 30 * 60 * 1000), // Set expiration time to 30 minutes from now
            });

            await otpData.save();

            if (isOtpSent) {
                return res.status(200).json({ 'status': 200, message: 'OTP sent successfully' });
            } else {
                return res.status(500).json({ 'status': 500, message: 'Failed to send OTP' });
            }
        } else {
            return res.status(400).json({ 'status': 500, message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ 'status': 500, message: 'Internal Server Error' });
    }
}

module.exports = {
    addInfo, getAllInfo, getInfoByUserId, invalidUserInfo, updateUserInfo, genrateBankOTP
};