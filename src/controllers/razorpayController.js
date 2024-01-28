const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const UserAmount = require('../models/userAmount');
const Operation = require('../models/razorPayOpration');
const { RAZORPAY } = require('../config');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay(
    { key_id: RAZORPAY.KEY_ID, key_secret: RAZORPAY.KEY_SECRET }
);

const createOrder = async (req, res) => {
    try {
        const aData = req.body;
        var option = aData.option;
        var userId = aData.userId;

        const order = await razorpay.orders.create(option);

        if (!order) {
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        } else {
            // Save operation to MongoDB
            var oOrderData = await Operation.insertCreatedOrder(order.id, (order.amount / 100),userId);
            if (oOrderData) {
                res.status(200).json({ status: 200, message: 'Order created successfully', body: order });
            }
        }
    } catch (error) {
        res.status(500).json({ status: 400, error: error });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId , userId } = req.body;

        // Validate request data
        if (!orderId) {
            throw new ValidationError('Order ID is required');
        }

        // Fetch the order details from Razorpay
        const order = await razorpay.orders.fetch(orderId);

        // Check if the order exists
        if (!order) {
            throw new ValidationError('Order not found');
        }

        // Check if the order is already canceled
        if (order.status === 'cancelled') {
            return res.status(200).json({ status: 200, message: 'Order already cancelled' });
        }

        var oUpdateFields = {
            "operation_type": "cancel_order",
            "status": 'inactive',
            "user_id": userId,
        };
        // Cancel the order in Razorpay
        var oOrderCancel = await Operation.updateOrder(orderId, oUpdateFields);

        // Respond with a success message
        res.status(200).json({ status: 200, message: 'Order cancelled successfully', body: oOrderCancel });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(400).json({ status: 400, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const validateOrder = async (req, res) => {
    try {
        const aData = req.body;
        const razorpay_payment_id = aData.razorpay_payment_id;
        const razorpay_order_id = aData.razorpay_order_id;
        const razorpay_signature = aData.razorpay_signature;
        const iUserID = aData.userId;

        // Using the defined hmac_sha256 function
        const generated_signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY.KEY_SECRET);

        if (generated_signature !== razorpay_signature) {
            res.status(400).json({ status: 500, error: 'Transaction is not legit!' });
        } else {
            var oUpdateFields = {
                "razorpay_payment_id": razorpay_payment_id,
                "operation_type": "validate_order",
                "generated_signature": generated_signature,
                "user_id": iUserID,
            };
            var oOrderData = await Operation.updateOrder(razorpay_order_id, oUpdateFields);

            const userAmountDetails = await UserAmount.currentBalanceByUserId(iUserID);

            if (userAmountDetails) {
                var InvalidResult = await UserAmount.invalidateUserAmount(iUserID);
            }
            if (InvalidResult) {
                var newAmount = userAmountDetails.available_amount + oOrderData.amount;
                const userAmountData = {
                    user_id: iUserID,
                    available_amount: newAmount,
                    value: oOrderData.amount,
                    transaction_type: 1,
                };

                const userAmount = await UserAmount.insertUserAmount(userAmountData);
                await userAmount.save();
            }
            if (oOrderData) {
                res.status(200).json({ status: 200, message: 'Successfully', body: { order_id: razorpay_order_id, payment_id: razorpay_payment_id } });
            }
        }
    } catch (error) {
        res.status(500).json({ status: 400, error: error });
    }
};

const failOrder = async (req,res)=>{
    
}


function hmac_sha256(data, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}


module.exports = {
    createOrder, validateOrder,cancelOrder
}