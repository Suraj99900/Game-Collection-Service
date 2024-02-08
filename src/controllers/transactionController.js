const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const orderFail = require('../models/orderFail');
const Operation = require('../models/razorPayOpration');
const { RAZORPAY } = require('../config');
const crypto = require('crypto');

const getTransaction = async (req, res) => {
    try {
        const userID = req.params.userId;
        const { resouresType } = req.query;

        let allOperations, allFailOrders;

        // ResourcesType 1 for Fetch all success and fail order
        if (resouresType == 1) {
            try {
                allOperations = await Operation.fetchAllOrderByUserId(userID);
                allFailOrders = await orderFail.getAllFailOrders();
            } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, error: 'Internal Server Error' });
            }
        } else if (resouresType == 2) {
            try {
                allOperations = await Operation.fetchAllOrderByUserId(userID);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, error: 'Internal Server Error' });
            }
        } else if (resouresType == 3) {
            try {
                allFailOrders = await orderFail.getAllFailOrders();
            } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, error: 'Internal Server Error' });
            }
        } else {
            return res.status(400).json({ status: 400, error: 'Invalid resouresType' });
        }

        // Combine and respond with transactions
        const combinedTransactions = combineTransactions(allOperations, allFailOrders, userID);
        res.status(200).json({ status: 200, body: combinedTransactions });
    } catch (error) {
        res.status(500).json({ status: 400, error: error.message });
    }
};

// Combine transactions based on user_id
const combineTransactions = (operations, failOrders, userID) => {
    const combinedTransactions = [];

    // Add operations to the combined array
    if (operations) {
        operations.forEach(operation => {
            if (operation.operation_type == 'validate_order') {
                combinedTransactions.push({
                    user_id: operation.user_id,
                    order_id: operation.razorpay_order_id,
                    amount: operation.amount,
                    status: 'success',
                });
            }
        });
    }

    // Add fail orders to the combined array
    if (failOrders) {
        failOrders.forEach(failOrder => {
            if (failOrder.user_id == userID) {
                combinedTransactions.push({
                    user_id: failOrder.user_id,
                    order_id: failOrder.order_id,
                    amount: 0,
                    status: 'fail',
                });
            }
        });
    }

    // Sort combinedTransactions by order_id
    combinedTransactions.sort((a, b) => a.order_id.localeCompare(b.order_id));
    return combinedTransactions;
};

module.exports = {
    getTransaction,
};
