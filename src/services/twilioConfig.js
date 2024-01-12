// twilioConfig.js
const twilio = require('twilio');
const config = require('../config'); // Adjust the path based on your project structure

const { accountSid, authToken, twilioPhoneNumber } = config.twilio;

const client = twilio(accountSid, authToken);

// Function to send OTP via Twilio SMS
const sendOtp = async (phoneNumber, otp) => {
    const message = `Your OTP for verification is: ${otp}`;

    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber,
        });

        if (response && response.sid) {
            console.log(`OTP sent successfully to ${phoneNumber}`);
            return true;
        } else {
            throw new Error('Failed to send OTP');
        }
    } catch (error) {
        console.error(`Error sending OTP to ${phoneNumber}: ${error.message}`);
        throw new Error(`Error sending OTP: ${error.message}`);
    }
};

module.exports = { sendOtp };
