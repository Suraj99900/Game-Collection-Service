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
        const result = await winGame.findOneAndUpdate({ _id: _id ,  status: 'active', deleted: false}, data, { new: true });
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
        const result = await winGame.find({ status: 'active', deleted: false});
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordById(recordId) {
    try {
        const result = await winGame.findOne({'_id': recordId ,  status: 'active', deleted: false});
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordBywinType(type) {
    try {
        const result = await winGame.findOne({ type: type ,  status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchLastActiveRecord(type) {
    try {
        const result = await winGame
            .findOne({ status: 'active', deleted: false, type:type })
            .sort({ addedOn: -1 }) // Sort in descending order based on addedOn
            .limit(1);

        return result;
    } catch (error) {
        throw error;
    }
}


// Add more functions as needed

module.exports = {
    insertRecord,
    updateRecord,
    fetchRecordBywinType,
    deleteRecordByRecordID,
    fetchAllRecords,
    fetchRecordById,
    fetchLastActiveRecord,
};
