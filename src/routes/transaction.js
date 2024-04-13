const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');
const userDebit = require('../controllers/DebitController');

// Order Transaction Details
router.get('/transaction/:userId',transaction.getTransaction);

router.post('/debit',userDebit.InsertDebitOrder);
router.get('/debit/:user_id',userDebit.fetchDebitRecordByUserId);

module.exports = router;
