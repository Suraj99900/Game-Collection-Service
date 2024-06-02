const { Schema, model } = require('mongoose');

const winGameUserBetSchema = new Schema({
    period: { type: String, required: true },
    user_id: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    number: { type: Number, required: false },
    amount: { type: String, required: true },
    isWin: { type: Boolean, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null }
});

const winGameUserBet = model('winGameUserBet', winGameUserBetSchema);

async function insertRecord(data) {
    try {
        const owinGameUserBet = new winGameUserBet(data);
        const result = await owinGameUserBet.save();
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRecord(_id, data) {
    try {
        const result = await winGameUserBet.findOneAndUpdate(
            { _id: _id, status: 'active', deleted: false },
            data,
            { new: true }
        );
        return result;
    } catch (error) {
        throw error;
    }
}
async function updateRecordByTypeColorPeriod(_id, data) {
    try {
        const result = await winGameUserBet.findOneAndUpdate(
            { _id: _id, status: 'active', deleted: false },
            data,
            { new: true }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRecordByRecordID(_id) {
    try {
        const result = await winGameUserBet.findOneAndUpdate(
            { _id: _id, status: 'active', deleted: false },
            { $set: { status: 'inactive', deleted: true, updatedOn: new Date() } },
            { new: true }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchAllRecords() {
    try {
        const result = await winGameUserBet.find({ status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordByUserId(userID) {
    try {
        const result = await winGameUserBet.find({ user_id: userID, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordById(recordId) {
    try {
        const result = await winGameUserBet.findOne({ '_id': recordId, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordBywinType(type) {
    try {
        const result = await winGameUserBet.find({ type: type, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordByTypePeriod(type, Period) {
    try {
        const result = await winGameUserBet.find({ type: type, period: Period, isWin: false, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchLastActiveRecord(type) {
    try {
        const result = await winGameUserBet
            .findOne({ status: 'active', deleted: false, type: type })
            .sort({ addedOn: -1 }) // Sort in descending order based on addedOn
            .limit(1);
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchLossRecord(iUserId, sType) {
    try {
        const result = await winGameUserBet
            .find({ status: 'active', deleted: false, type: sType, user_id: iUserId, isWin: false })
            .sort({ addedOn: -1 });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchWinLossRecords(iUserId, sType) {
    try {
        const result = await winGameUserBet.aggregate([
            {
                $match: {
                    user_id: iUserId,
                    type: sType,
                }
            },
            {
                $addFields: {
                    winGameId: {
                        $toString: "$_id",
                    },
                },
            },
            {
                $lookup: {
                    from: "wingames",
                    localField: "period",
                    foreignField: "period",
                    as: "aWingameResult",
                },
            },
            {
                $lookup: {
                    from: "gamewinners",
                    localField: "winGameId",
                    foreignField: 'gameid',
                    as: "isWinData",
                },
            },
            {
                $addFields: {
                    includeAllData: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$isWinData",
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $unwind: "$aWingameResult",
            },
            {
                $match: {
                    $expr: {
                        $eq: ["$type", "$aWingameResult.type"],
                    },
                    "aWingameResult.status" : "inactive",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    status: {
                        $first: "$status",
                    },
                    addedOn: {
                        $first: "$addedOn",
                    },
                    period: {
                        $first: "$period",
                    },
                    type: {
                        $first: "$type",
                    },
                    color: {
                        $first: "$color",
                    },
                    number: {
                        $first: "$number",
                    },
                    isWin: {
                        $first: "$isWin",
                    },
                    amount: {
                        $first: "$amount",
                    },
                    isWinData: {
                        $first: {
                            $cond: [
                                {
                                    $eq: [
                                        {
                                            $size: "$isWinData",
                                        },
                                        0,
                                    ],
                                },
                                null,
                                {
                                    $arrayElemAt: ["$isWinData", 0],
                                },
                            ],
                        },
                    },
                },
            },
            {
                $sort: {
                    addedOn: -1,
                },
            },
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    insertRecord,
    updateRecord,
    fetchRecordBywinType,
    deleteRecordByRecordID,
    fetchAllRecords,
    fetchRecordById,
    fetchLastActiveRecord,
    fetchRecordByUserId,
    fetchRecordByTypePeriod,
    fetchLossRecord,
    fetchWinLossRecords,
};
