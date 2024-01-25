const express = require('express');
const router = express.Router();
const razorController = require('../controllers/razorpayController');

// Define user-related routes

router.post('/order', razorController.createOrder);
router.post('/validate', razorController.validateOrder);
router.post('/cancel-order',razorController.cancelOrder);
// Add more routes as needed

module.exports = router;
