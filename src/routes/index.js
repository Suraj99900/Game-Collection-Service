const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const razorRoutes = require('./razorRoutes');
const transaction = require('./transaction');
const winGame = require('./winGameRoutes');

// Include user routes
router.use('/users', userRoutes);
router.use('/razorpay',razorRoutes);
router.use('/transactions',transaction);
router.use('/games',winGame);
// Add more route modules as needed

module.exports = router;
