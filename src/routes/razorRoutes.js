const express = require('express');
const router = express.Router();
const razorController = require('../controllers/razorpayController');
const failOrderController = require('../controllers/failOrderController');

// Define user-related routes

router.post('/order', razorController.createOrder);
router.post('/validate', razorController.validateOrder);
router.post('/cancel-order',razorController.cancelOrder);

// fial order API
router.post('/fail-order',failOrderController.createFailOrder);
router.put('/fail-order',failOrderController.updateFailOrderController);
router.get('/fail-order',failOrderController.getAllFailOrder);
router.get('/fail-order/:orderId',failOrderController.getFailOrderByOrderID);
router.delete('/fail-order/:orderId',failOrderController.deleteFailOrderController);


module.exports = router;
