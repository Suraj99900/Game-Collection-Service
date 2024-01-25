const mongoose = require('mongoose');

const userAmountSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    available_amount: { type: Number, required: true },
    transaction_type: { type: Number, required: true },
    value: { type: Number, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const UserAmount = mongoose.model('UserAmount', userAmountSchema);

const currentBalanceByUserId = async (userId = '') => {
    return await UserAmount.findOne({
        user_id: userId,
        status: 'active',
        deleted: false,
    });
}

const insertUserAmount = async (userAmountData) => {
    try {
        return new UserAmount(userAmountData);
    } catch (error) {
        throw error;
    }
}

const updateUserAmount = async (userId, updateFields) => {
    try {
        const userAmount = await UserAmount.findOneAndUpdate(
            { user_id: userId, status: 'active', deleted: false },
            { $set: updateFields },
            { new: true }
        );
        return userAmount;
    } catch (error) {
        throw error;
    }
}

const invalidateUserAmount = async (userId) => {
    try {
        const userAmount = await UserAmount.findOneAndUpdate(
            { user_id: userId , status: 'active', deleted: false },
            { $set: { status: 'inactive', deleted: true, updatedOn: new Date() } },
            { new: true }
        );
        return userAmount;
    } catch (error) {
        throw error;
    }
}

module.exports = { currentBalanceByUserId, UserAmount, insertUserAmount, updateUserAmount, invalidateUserAmount };
