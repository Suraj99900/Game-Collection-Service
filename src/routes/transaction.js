const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transactionController');
const userDebit = require('../controllers/DebitController');

// Order Transaction Details
router.get('/transaction/:userId',transaction.getTransaction);

router.post('/debit',userDebit.InsertDebitOrder);
router.put('/debit/:id',userDebit.updateDebitRecord);
router.get('/debit/:user_id',userDebit.fetchDebitRecordByUserId);
router.get('/debit-staff',userDebit.fetchAllDebitRecord);
router.get('/debit-staff-bank/:id',userDebit.fetchAllDebitDetialsWithBanksById);

module.exports = router;
