const mongoose = require('mongoose');

const failOrderScheme = new mongoose.Schema({
    user_id: { type: String, require: true },
    order_id: { type: String, require: true },
    payment_id: { type: String },
    code: { type: String },
    reason: { type: String },
    description: { type: String },
    source: { type: String },
    step: { type: String },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
})

const FailOrder = mongoose.model('fail_order', failOrderScheme);

const insertFailOrder = async (data) => {
    try {
        const newFailOrder = new FailOrder(data);
        const result = await newFailOrder.save();
        return result;
    } catch (error) {
        throw error;
    }
};

const getAllFailOrders = async () => {
    try {
        const failOrders = await FailOrder.find({ deleted: false, status: 'active' });
        return failOrders;
    } catch (error) {
        throw error;
    }
};

const getFailOrderByOrderId = async (orderId) => {
    try {
        const failOrder = await FailOrder.findOne({ order_id: orderId, deleted: false, status: 'active' });
        return failOrder;
    } catch (error) {
        throw error;
    }
};

const updateFailOrder = async (failOrderId, updateData) => {
    try {
        const result = await FailOrder.findByIdAndUpdate(failOrderId, { $set: updateData }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteFailOrder = async (failOrderId) => {
    try {
        const result = await FailOrder.findByIdAndUpdate(failOrderId, { deleted: true, status: 'inactive' }, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = { FailOrder,insertFailOrder,updateFailOrder,getAllFailOrders,getFailOrderByOrderId,deleteFailOrder };
