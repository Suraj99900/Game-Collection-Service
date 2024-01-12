const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const { sendOtp } = require('../services/twilioConfig'); // Create twilioConfig.js and implement sendOtp function
const crypto = require('crypto');

const createUser = async (req, res) => {
    try {
        const { username, email, phoneNumber, password, status, deleted } = req.body;

        // Validate request data
        if (!username || !email) {
            throw new ValidationError('Username and email are required');
        }

        // Create a new user instance with the provided data
        const user = new User({
            username,
            email,
            phoneNumber,
            password,
            status: status || 'active',
            deleted: deleted || false,
        });

        // Save the user to the database
        await user.save();

        // Respond with a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const genrateOTP = async (req, res) => {
    try {
        const { phone_number } = req.body;

        if (!phone_number) {
            return res.status(400).json({ message: 'Missing phone_number parameter' });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);

        // Send OTP via SMS (implement this function in twilioConfig.js)
        const isOtpSent = await sendOtp(phone_number, otp);

        if (isOtpSent) {
            return res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const test = async (req, res) => {
    res.status(201).json({ message: 'working' });
};

module.exports = {
    createUser,
    test,
    genrateOTP,
    // Add more controller methods as needed
};
