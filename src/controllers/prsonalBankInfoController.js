const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const { sendOtp } = require('../services/twilioConfig'); // Create twilioConfig.js and implement sendOtp function
const crypto = require('crypto');
const Otp = require('../models/otp');
const UserAmount = require('../models/userAmount');
const UserInfo = require('../models/userInfo');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt


const addInfo = async (req, res) => {
    try {
        const { user_id, actual_name, ifsc_code, account_number, bank_name, state, city, address, mobile_no, email, upi_id } = req.body;

        // Validate request data
        if (!user_id || !actual_name || !ifsc_code || !account_number || !bank_name || !mobile_no || !email || !upi_id) {
            throw new ValidationError('UserId, IFSC Code , Account Number, Bank Name , MobileNumber , Email and UPIID are required');
        }


        var oUserInfo = await UserInfo.insertRecord({
            user_id, actual_name, ifsc_code, account_number, bank_name, mobile_no, email, upi_id
        });

        console.log(oUserInfo);
        // Respond with a success message
        res.status(201).json({ status: 200, message: 'User Info Added successfully', body: oUserInfo });

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
};

const invalidUserInfo = async (req, res) => {
    try {
        const { _id } = req.params;
        var oUserInfo = await UserInfo.deleteRecord(_id);

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



module.exports = {
    addInfo, getAllInfo, getInfoByUserId, invalidUserInfo, updateUserInfo
};