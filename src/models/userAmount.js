const mongoose = require('mongoose');
const moment = require('moment');
const { ObjectId } = require('mongodb');

const userAmountSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    available_amount: { type: Number, required: true },
    transaction_type: { type: Number, required: true },
    value: { type: Number, required: true },
    transaction_status: { type: String, default: "" },
    debit_user_genrated: { type: Boolean, default: false },
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
const updateUserAmountById = async (id, updateFields) => {
    try {
        const userAmount = await UserAmount.findOneAndUpdate(
            { _id: id },
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
            { user_id: userId, status: 'active', deleted: false },
            { $set: { status: 'inactive', deleted: true, updatedOn: new Date() } },
            { new: true }
        );
        return userAmount;
    } catch (error) {
        throw error;
    }
}

const fetchDebitRecordByUserId = async (userId) => {
    try {
        const oResult = await UserAmount.find({
            user_id: userId, transaction_type: 2, debit_user_genrated: true
        }).sort({ addedOn: -1 });

        return oResult;
    } catch (error) {
        throw (error)
    }
}

// Static method to count records for a user on a specific day
const countRecordsForUserOnDay = async (userId, day) => {
    const startOfDay = moment(day).startOf('day');
    const endOfDay = moment(day).endOf('day');
    return await UserAmount.find({
        user_id: userId, transaction_type: 2, transaction_status: "pending", debit_user_genrated: true,
        addedOn: { $gte: startOfDay, $lte: endOfDay },
    });
};

const fetchAllDebitRecord = async () => {
    try {
        const oResult = await UserAmount.aggregate([
            {
                '$addFields': {
                    'newUserId': {
                        '$toObjectId': '$user_id'
                    }
                }
            }, {
                '$match': {
                    'transaction_type': 2,
                    'transaction_status': 'pending',
                    'debit_user_genrated': true
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'newUserId',
                    'foreignField': '_id',
                    'as': 'userData'
                }
            }, {
                '$addFields': {
                    'userData': {
                        '$arrayElemAt': [
                            '$userData', 0
                        ]
                    }
                }
            }, {
                '$sort': {
                    'addedOn': -1
                }
            }
        ]);

        return oResult;
    } catch (error) {
        throw (error)
    }
}


const fetchAllDebitDetialsWithBanksById = async (iId) => {
    try {
        const oResult = await UserAmount.aggregate([
            {
                '$addFields': {
                    'newUserId': {
                        '$toObjectId': '$user_id'
                    }
                }
            }, {
                '$match': {
                    _id: new ObjectId(iId),
                    'transaction_type': 2,
                    'transaction_status': 'pending',
                    'debit_user_genrated': true
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'newUserId',
                    'foreignField': '_id',
                    'as': 'userData'
                }
            }, {
                '$lookup': {
                    'from': 'userinfos',
                    'localField': 'user_id',
                    'foreignField': 'user_id',
                    'as': 'bankDetails'
                }
            }, {
                '$addFields': {
                    'userData': {
                        '$arrayElemAt': [
                            '$userData', 0
                        ]
                    },
                    'bankDetails': {
                        '$arrayElemAt': [
                            '$bankDetails', 0
                        ]
                    }
                }
            }, {
                '$sort': {
                    'addedOn': -1
                }
            }
        ]);

        return oResult;
    } catch (error) {
        throw (error)
    }
}


module.exports = { currentBalanceByUserId, UserAmount, insertUserAmount, updateUserAmount, invalidateUserAmount, fetchDebitRecordByUserId, countRecordsForUserOnDay, fetchAllDebitRecord, fetchAllDebitDetialsWithBanksById,updateUserAmountById };
