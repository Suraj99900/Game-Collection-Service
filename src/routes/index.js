const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const razorRoutes = require('./razorRoutes');
const transaction = require('./transaction');
const winGame = require('./winGameRoutes');
const staffRoute = require('./staffRoute');
const referRoute = require('./referCodeRoute');
const bannerRoute = require('./bannerRoute');

// Include user routes
router.use('/users', userRoutes);
router.use('/razorpay',razorRoutes);
router.use('/transactions',transaction);
router.use('/games',winGame);
router.use('/staff',staffRoute);
router.use('/refer',referRoute);

router.use('/banner',bannerRoute);
// Add more route modules as needed

module.exports = router;
