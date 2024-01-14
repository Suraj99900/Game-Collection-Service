const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    number: { type: String, required: true },
    otp: { type: String, required: true, unique: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    expirationTime: {
        type: Date,
        default: function () {
            // Set expiration time to 30 minutes greater than creation time
            return new Date(this.creationTime.getTime() + 30 * 60000);
        }
    },
    creationTime: { type: Date, default: Date.now },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
