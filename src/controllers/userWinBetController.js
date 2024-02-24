const { ValidationError } = require('../exceptions/errorHandlers');
const winUserBetModel = require('../models/winUserBet');
const UserAmount = require('../models/userAmount');
const insertWinUserBet = async (req, res) => {
    const { period, user_id, type, color, number, amount } = req.body;
    console.log(type);
    console.log(color);
    console.log(number);
    console.log(amount);
    console.log(user_id);
    try {
        // Validate request data
        if (!type || !period || !user_id || !color || !number || !amount) {
            throw new ValidationError('type, period, user_id, color, number, and amount are required');
        }

        // Extra changes...
        if (isNaN(amount) || amount < 3) {
            throw new ValidationError('Amount should be a valid number greater than or equal to 3');
        }
        const userAmountDetails = await UserAmount.currentBalanceByUserId(user_id);

        if(userAmountDetails.available_amount < amount){
            throw new ValidationError('Amount is less.');
        }
        // Adjust amount as needed
        const adjustedAmount = amount - 3;

        if (userAmountDetails) {
            const InvalidResult = await UserAmount.invalidateUserAmount(user_id);

            if (InvalidResult) {
                const newAmount = parseInt(userAmountDetails.available_amount, 10) - parseInt(amount, 10);
                const userAmountData = {
                    user_id: user_id,
                    available_amount: newAmount,
                    value: amount,
                    transaction_type: 2,
                };

                const userAmount = await UserAmount.insertUserAmount(userAmountData);
                await userAmount.save();
            }
        }

        // Insert record
        const insertData = await winUserBetModel.insertRecord({
            period,
            type,
            user_id,
            color,
            number,
            amount: adjustedAmount,
            isWin: false
        });

        if (insertData) {
            res.status(201).json({ status: 201, message: 'Win User Bet Record created successfully', data: insertData });
        } else {
            res.status(500).json({ status: 500, error: 'Error While Inserting Data' });
        }

    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ status: 400, error: error.message });
        } else {
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    insertWinUserBet,
};
