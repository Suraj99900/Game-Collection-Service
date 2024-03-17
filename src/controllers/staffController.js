const Staff = require('../models/staff');
const { ValidationError } = require('../exceptions/errorHandlers');
const { sendOtp } = require('../services/twilioConfig'); // Create twilioConfig.js and implement sendOtp function
const crypto = require('crypto');
const Otp = require('../models/otp');
const bcrypt = require('bcrypt');
const { client, fetchClientById } = require('../models/client');
const saltRounds = 10; // Number of salt rounds for bcrypt


const createStaff = async (req, res) => {
    try {
        const { staffname, phoneNumber, otp, password, status, deleted, key } = req.body;

        // Validate request data
        if (!staffname || !phoneNumber || !otp || !password || !key) {
            throw new ValidationError('Staffname, phone, key, otp, and password are required');
        }

        // check clientId is valid or not 
        const aCheckClient = await fetchClientById(key);

        if (aCheckClient.length == 0) {
            throw new ValidationError('Wrong key.');
        }

        const activeOtp = await Otp.findOne({
            number: phoneNumber,
            otp: otp,
            status: 'active',
            deleted: false,
            expirationTime: { $gt: new Date() },
        });

        if (activeOtp) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create a new Staff instance with the provided data and hashed password
            const staff = await Staff.createStaff(staffname, phoneNumber, hashedPassword, status, false);

            // Save the Staff to the database
            let savedStaff = await staff.save();

            // Set OTP status to used
            activeOtp.status = 'used';
            if (activeOtp) {
                await activeOtp.save();

                // Respond with a success message
                res.status(201).json({ status: 200, message: 'Staff created successfully' });
            } else {
                return res.status(500).json({ 'status': 500, message: 'Something went wrong' });
            }

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


const genrateOTP = async (req, res) => {
    try {
        const { phone_number } = req.body;

        if (!phone_number) {
            return res.status(400).json({ message: 'Missing phone_number parameter' });
        }

        // Check if the phone number exists in the Staff table
        const staffExists = await Staff.checkStaffExist(phone_number);

        if (staffExists == null) {
            // Check if an active OTP already exists for the phone number
            const activeOtp = await Otp.findOne({
                number: phone_number,
                status: 'active',
                deleted: false,
                expirationTime: { $gt: new Date() }, // Check if expirationTime is greater than the current time
            });

            if (activeOtp) {
                // If an active OTP exists, inform the Staff that OTP has already been sent
                return res.status(200).json({ 'status': 200, message: 'OTP already sent. Please check your messages.' });
            }

            // Generate a 6-digit OTP
            const otp = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);

            // Send OTP via SMS (implement this function in twilioConfig.js)
            const isOtpSent = await sendOtp(phone_number, otp);

            // Save OTP to the OTP model
            const otpData = new Otp({
                number: phone_number,
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
            return res.status(400).json({ 'status': 500, message: 'Number already registered.' });
        }
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ 'status': 500, message: 'Internal Server Error' });
    }
};

const loginStaff = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validate request data
        if (!phoneNumber || !password) {
            throw new ValidationError('Phone number and password are required');
        }
        var sPhoneNumber = '+91' + phoneNumber;
        // Find the staff by phoneNumber
        const staff = await Staff.fetchStaffByPhoneNumber(sPhoneNumber);

        if (staff) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, staff.password);
            if (passwordMatch) {
                // Passwords match, login successful
                res.status(200).json({ status: 200, message: 'Login successful', body: staff });
            } else {
                // Passwords do not match
                throw new ValidationError('Invalid password');
            }
        } else {
            // staff not found
            throw new ValidationError('staff not found or inactive');
        }
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(401).json({ status: 401, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};

const fetchAllStaff = async (req, res) => {
    try {

        // ! Fetch Active Staff
        const oStaff = await Staff.fetchAllStaff();
        return res.status(200).json({ status: 200, message: "Staff Details fetched successfully", body: oStaff });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(401).json({ status: 401, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const fetchStaffByStaffId = async (req, res) => {
    const { staffId } = req.params;
    try {
        // validate staff Id present or not 
        if (!staffId) {
            throw new ValidationError('Staff id are required');
        }

        // update the data by staff id 
        const oStaffData = await Staff.fetchStaffByStaffId(staffId);
        return res.status(200).json({ status: 200, message: "Staff Details Fetch Successfully", body: oStaffData });

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(401).json({ status: 401, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};


const updateStaffById = async (req, res) => {

    const { staffId } = req.params;
    const { staffname } = req.body;
    try {

        // validate staff Id present or not 
        if (!staffId) {
            throw new ValidationError('Staff id are required');
        }

        // update the data by staff id 
        const oStaffData = await Staff.updateStaff(staffId, { staffname });
        return res.status(200).json({ status: 200, message: "Staff Details Updated Successfully", body: oStaffData });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(401).json({ status: 401, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const deleteStaffById = async (req, res) => {
    const { staffId } = req.params;

    try {

        if (!staffId) {
            throw new ValidationError('Staff Id are required');
        }

        // invalid the record
        const oStaff = Staff.invalidStaffByID(staffId);

        res.status(200).json({
            status: 200, message: "Record Deleted Successfully", body: oStaff
        });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(401).json({ status: 401, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    createStaff,
    genrateOTP,
    loginStaff,
    fetchAllStaff,
    updateStaffById,
    fetchStaffByStaffId,
    deleteStaffById,
};