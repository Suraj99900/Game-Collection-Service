const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const { sendOtp } = require('../services/twilioConfig'); // Create twilioConfig.js and implement sendOtp function
const crypto = require('crypto');
const Otp = require('../models/otp');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt


const createUser = async (req, res) => {
    try {
        const { username, phoneNumber, otp, password, status, deleted } = req.body;

        // Validate request data
        if (!username || !phoneNumber || !otp || !password) {
            throw new ValidationError('Username, phone, otp, and password are required');
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

            // Create a new user instance with the provided data and hashed password
            const user = new User({
                username,
                phoneNumber,
                password: hashedPassword,
                status: status || 'active',
                deleted: deleted || false,
            });

            // Save the user to the database
            await user.save();
        } else {
            throw new ValidationError('Please enter a valid otp');
        }

        // Respond with a success message
        res.status(201).json({ status: 200, message: 'User created successfully' });
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

        // Check if the phone number exists in the user table
        const userExists = await User.exists({ phoneNumber: phone_number });

        if (userExists == null) {
            // Check if an active OTP already exists for the phone number
            const activeOtp = await Otp.findOne({
                number: phone_number,
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


const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validate request data
        if (!phoneNumber || !password) {
            throw new ValidationError('Phone number and password are required');
        }
        var sPhoneNumber = '+91'+phoneNumber;
        // Find the user by phoneNumber
        const user = await User.findOne({
            phoneNumber: sPhoneNumber,
            status: 'active',
            deleted: false,
        });

        if (user) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Passwords match, login successful
                res.status(200).json({ status: 200, message: 'Login successful' , body: user });
            } else {
                // Passwords do not match
                throw new ValidationError('Invalid password');
            }
        } else {
            // User not found
            throw new ValidationError('User not found or inactive');
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


const test = async (req, res) => {
    res.status(201).json({ message: 'working' });
};

module.exports = {
    createUser,
    test,
    genrateOTP,
    loginUser,
    // Add more controller methods as needed
};
