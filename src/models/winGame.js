const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');

const winGameSchema = new mongodb.Schema({
    period: { type: String, require: true },
    type: { type: String, require: true },
    color: { type: String, require: true },
    number: { type: Number, require: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null }
});

const winGame = mongoose.model('winGame', winGameSchema);


async function insertRecord(data) {
    try {
        const oWinGame = new winGame(data);
        const result = await oWinGame.save();
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRecord(_id, data) {
    try {
        const result = await winGame.findOneAndUpdate({ _id: _id, status: 'active', deleted: false }, data, { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRecordByRecordID(_id) {
    try {
        const result = await winGame.findOneAndUpdate({ _id: _id, status: 'active', deleted: false },
            { $set: { status: 'inactive', deleted: true, updatedOn: new Date() } },
            { new: true });
        return result;
    } catch (error) {
        throw error;
    }
}


async function fetchAllRecords() {
    try {
        const result = await winGame.find({ status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordById(recordId) {
    try {
        const result = await winGame.findOne({ '_id': recordId, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordBywinTypeAndPeriod(type, Period) {
    try {
        const result = await winGame.findOne({ type: type, period: Period, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}
async function fetchRecordBywinType(type) {
    try {
        const result = await winGame.find({ type: type, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordDeletedBywinType(type, sortByField = 'addedOn', sortOrder = 'desc') {
    try {
        const sortQuery = {};
        sortQuery[sortByField] = sortOrder === 'asc' ? 1 : -1;

        const result = await winGame
            .find({ type: type, status: 'inactive', deleted: true })
            .sort(sortQuery);

        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchLastInActiveRecord() {
    try {
        const result = await winGame
            .findOne({ status: 'inactive', deleted: true })
            .sort({ addedOn: -1 }) // Sort in descending order based on addedOn
            .limit(1);

        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchLastActiveRecord() {
    try {
        const result = await winGame
            .findOne({ status: 'active', deleted: false })
            .sort({ addedOn: -1 }) // Sort in descending order based on addedOn
            .limit(1);

        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchCurrentActiveRecord() {
    try {
        const oResult = await winGame.aggregate([
            {
                $match: {
                    status: 'active',
                    deleted: false
                }
            },
            {
                $lookup: {
                    from: "wingameuserbets",
                    localField: "period",
                    foreignField: "period",
                    as: "aUserBetRecord"
                }
            },
            {
                $unwind: "$aUserBetRecord"
            },
            {
                $match: {
                    $expr: {
                        $eq: ["$type", "$aUserBetRecord.type"]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    status:{$first: "$status"},
                    addedOn: { $first: "$addedOn" }, // Retain the 'addedOn' field
                    sameColorsCount: { $sum: { $cond: [{ $eq: ["$color", "$aUserBetRecord.color"] }, 1, 0] } }, // Sum of matching colors
                    sameNumberCount: { $sum: { $cond: [{ $eq: ["$number", "$aUserBetRecord.number"] }, 1, 0] } }, // Sum of matching numbers
                    sameNumberAndColorCount: { 
                        $sum: { 
                            $cond: [{ $and: [{ $eq: ["$number", "$aUserBetRecord.number"] }, { $eq: ["$color", "$aUserBetRecord.color"] }] }, 1, 0] 
                        } 
                    }, // Sum of matching colors and number
                    matchedColorAmount: { $sum: { $cond: [{ $eq: ["$color", "$aUserBetRecord.color"] }, { $toInt: "$aUserBetRecord.amount" }, 0] } }, // Sum of amounts for matching colors
                    matchedNumberAmount: { $sum: { $cond: [{ $eq: ["$number", "$aUserBetRecord.number"] }, { $toInt: "$aUserBetRecord.amount" }, 0] } }, // Sum of amounts for matching numbers
                    matchedNumberAndColorAmount: { 
                        $sum: { 
                            $cond: [{ $and: [{ $eq: ["$number", "$aUserBetRecord.number"] }, { $eq: ["$color", "$aUserBetRecord.color"] }] }, { $toInt: "$aUserBetRecord.amount" }, 0] 
                        } 
                    }, // Sum of amounts for matching numbers and color
                    amounts: { $sum: { $toInt: "$aUserBetRecord.amount" } }, // Sum of amounts
                    period: { $first: "$period" }, // Retain the 'period' field for later use
                    type: { $first: "$type" }, // Retain the 'type' field for later use
                    number: { $first: "$number" },
                    color: { $first: "$color" },
                    aUserBetRecord: { $push: "$aUserBetRecord" } // Create an array of aUserBetRecord documents
                }
            },
            {
                $sort: { addedOn: -1 }
            }
        ]);

        return oResult;
    } catch (error) {
        console.error("Error fetching current active record:", error);
        throw error;
    }
}





// Add more functions as needed

module.exports = {
    insertRecord,
    updateRecord,
    fetchRecordBywinTypeAndPeriod,
    deleteRecordByRecordID,
    fetchRecordBywinType,
    fetchAllRecords,
    fetchRecordById,
    fetchLastActiveRecord,
    fetchRecordDeletedBywinType,
    fetchLastInActiveRecord,
    fetchCurrentActiveRecord,
};
