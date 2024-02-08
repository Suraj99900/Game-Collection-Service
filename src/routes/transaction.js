const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');

// Order Transaction Details
router.get('/transaction/:userId',transaction.getTransaction)

module.exports = router;
