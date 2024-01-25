const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const razorRoutes = require('./razorRoutes');

// Include user routes
router.use('/users', userRoutes);
router.use('/razorpay',razorRoutes);
// Add more route modules as needed

module.exports = router;
