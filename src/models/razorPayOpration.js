
const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
    razorpay_order_id: { type: String, required: true, unique: true },
    razorpay_payment_id: { type: String },
    user_id: { type: String, required: true },
    generated_signature:{type:String},
    operation_type: { type: String }, // 'create_order' or 'validate_order' or 'cancel_order'
    amount: { type: Number, default: 0 },
    transaction_type: { type: Number },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const Operation = mongoose.model('razorpay_opration', operationSchema);


const insertCreatedOrder = async (iOrderId, iAmount,userId) => {
    try {
        return Operation.create({
            razorpay_order_id: iOrderId,
            amount: iAmount,
            user_id: userId,
            razorpay_payment_id: null, // Since this is the creation step
            operation_type: 'create_order',
            transaction_type: 1,
        });
    } catch (error) {
        throw error;
    }
}

const updateOrder = async (orderId, oUpdateFields) => {
    try {
        const operation = await Operation.findOneAndUpdate(
            { razorpay_order_id: orderId },
            { $set: oUpdateFields },
            { new: true }
        );
        return operation;
    } catch (error) {
        throw error;
    }
}


const fetchAllOrderByUserId = async (userId)=>{
    try {
        return Operation.find({ user_id: userId, deleted: false });
    } catch (error) {
        throw error;
    }
}
module.exports = { Operation, insertCreatedOrder, updateOrder,fetchAllOrderByUserId };
