const { ValidationError } = require('../exceptions/errorHandlers');
const winUserBetModel = require('../models/winUserBet');
const winGame = require('../models/winGame.js');
const UserAmount = require('../models/userAmount');
const userGameModel = require('../models/gameWinner.js');
const insertWinUserBet = async (req, res) => {
    const { period, user_id, type, color, number, amount } = req.body;
    try {
        // Validate request data
        if (!type || !period || !user_id || !color || !amount) {
            throw new ValidationError('type, period, user_id, color, and amount are required');
        }

        // Extra changes...
        if (isNaN(amount) || amount < 3) {
            throw new ValidationError('Amount should be a valid number greater than or equal to 3');
        }
        const userAmountDetails = await UserAmount.currentBalanceByUserId(user_id);

        if (userAmountDetails.available_amount < amount) {
            throw new ValidationError('Amount is less.');
        }
        // Adjust amount as needed
        const adjustedAmount = amount - 0.03;

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

const fetchUserWinRecord = async (req, res) => {
    const { gameType, user_id } = req.query;

    try {
        // Validate request data
        if (!gameType || !user_id) {
            throw new ValidationError('gameType, user_id are required');
        }

        const aUserWinRecord = await userGameModel.fetchUserWinRecordData(user_id,gameType,'win');

        if (aUserWinRecord) {
            res.status(200).json({ status: 200, message: 'Win User Bet Record fetch successfully', data: aUserWinRecord });
        } else {
            res.status(500).json({ status: 500, error: 'Error While fetch Data' });
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


const fetchUserLossRecord = async(req,res)=>{
    const { gameType, user_id } = req.query;
    try {
        // Validate request data
        if (!gameType || !user_id) {
            throw new ValidationError('gameType, user_id are required');
        }

        const aUserLossRecord = await winUserBetModel.fetchLossRecord(user_id,gameType);

        if (aUserLossRecord) {
            res.status(200).json({ status: 200, message: 'Loass user bet record fetch successfully', data: aUserLossRecord });
        } else {
            res.status(500).json({ status: 500, error: 'Error While fetch Data' });
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

const fetchWinLossRecord = async (req,res)=>{

    const { gameType, user_id } = req.query;

    try {
        // Validate request data
        if (!gameType || !user_id) {
            throw new ValidationError('gameType, user_id are required');
        }

        const aUserWinLossData = await winUserBetModel.fetchWinLossRecords(user_id,gameType);

        if (aUserWinLossData) {
            res.status(200).json({ status: 200, message: 'user bet record fetch successfully', data: aUserWinLossData });
        } else {
            res.status(500).json({ status: 500, error: 'Error While fetch data' });
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


const fetchWinGameActiveTableData = async(req,res)=>{
    try {

        const aRecord = await winGame.fetchCurrentActiveRecord();

        if (aRecord) {
            res.status(200).json({ status: 200, message: 'Win Record fetch successfully', body: aRecord });
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
    fetchUserWinRecord,
    fetchUserLossRecord,
    fetchWinGameActiveTableData,
    fetchWinLossRecord,
};
