const UserAmount = require('../models/userAmount');
const moment = require('moment');
const { ValidationError } = require('../exceptions/errorHandlers');
const { User } = require('../models/user');

const InsertDebitOrder = async (req, res) => {
    try {
        const { user_id, value } = req.body;
        var userAmount;
        // Validate request data
        if (!user_id || !value) {
            throw new ValidationError('user_id ,value is required');
        }

        const today = moment().startOf('day');
        const count = await UserAmount.countRecordsForUserOnDay(user_id, today);

        if (count.length >= 3) {
            throw new ValidationError('Limit reached: You can genrate 3 debit record per day');
        }
        

        // Fetch Preivous Amount
        const userAmountDetails = await UserAmount.currentBalanceByUserId(user_id);
        if (userAmountDetails.available_amount < value) {
            throw new ValidationError('Dont have a valid amount to debit...');
        }
        if (userAmountDetails) {
            var InvalidResult = await UserAmount.invalidateUserAmount(user_id);
        }
        if (InvalidResult) {
            var newAmount = userAmountDetails.available_amount - value;
            const userAmountData = {
                user_id: user_id,
                available_amount: newAmount,
                value: value,
                transaction_type: 2,
                transaction_status:'pending',
                debit_user_genrated:true,
            };

            userAmount = await UserAmount.insertUserAmount(userAmountData);
            await userAmount.save();
        }
        if (userAmount) {
            res.status(200).json({ status: 200, message: 'Successfully', body: userAmount});
        }


    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};


const fetchDebitRecordByUserId = async (req,res)=>{
    try {
        const { user_id } = req.params;
        // Validate request data
        if (!user_id) {
            throw new ValidationError('user_id is required');
        }

        // Fetch Debit Amount
        const userDebitAmoount = await UserAmount.fetchDebitRecordByUserId(user_id);

        if (userDebitAmoount) {
            res.status(200).json({ status: 200, message: 'Successfully', body: userDebitAmoount});
        }

    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}


const fetchAllDebitRecord = async (req,res)=>{
    try {

        // Fetch Debit Amount
        const userDebitAmoount = await UserAmount.fetchAllDebitRecord();

        if (userDebitAmoount) {
            res.status(200).json({ status: 200, message: 'Successfully', body: userDebitAmoount});
        }

    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const fetchAllDebitDetialsWithBanksById = async (req,res)=>{
    const {id} = req.params;
    try {

        // Fetch Debit Amount
        const userDebitAmoount = await UserAmount.fetchAllDebitDetialsWithBanksById(id);

        if (userDebitAmoount) {
            res.status(200).json({ status: 200, message: 'Successfully', body: userDebitAmoount});
        }

    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const updateDebitRecord = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you pass the ID of the record to be updated in the URL

        // Validate request data
        if (!id) {
            throw new ValidationError('id are required for update');
        }

        const oUpdatedRecord = await UserAmount.updateUserAmountById(id,{transaction_status:'completed'});
        console.log(id);
        // Send a success response
        res.status(200).json({ status: 200, message: 'Debit record updated successfully', body: oUpdatedRecord });
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 400, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
};






module.exports = {
    InsertDebitOrder,
    fetchDebitRecordByUserId,
    fetchAllDebitRecord,
    updateDebitRecord,
    fetchAllDebitDetialsWithBanksById,
};
