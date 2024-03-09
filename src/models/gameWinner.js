const { Schema, model } = require('mongoose');

const winGameSchema = new Schema({
    gameid: { type: String, required: true },
    type: { type: String, require: true },
    color: { type: String, require: true },
    number: { type: String, require: true },
    user_id: { type: String, required: true },
    gameType: { type: String, required: true },
    amount: { type: String, required: true },
    winAmount: { type: Number, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null }
});

const WinGame = model('gamewinner', winGameSchema);

async function insertRecord(data) {
    try {
        const winGameRecord = new WinGame(data);
        const result = await winGameRecord.save();
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateRecord(gameId, data) {
    try {
        const result = await WinGame.findOneAndUpdate(
            { gameid: gameId, status: 'active', deleted: false },
            data,
            { new: true }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRecordByGameId(gameId) {
    try {
        const result = await WinGame.findOneAndUpdate(
            { gameid: gameId, status: 'active', deleted: false },
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
        const result = await WinGame.find({ status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordByGameId(gameId) {
    try {
        const result = await WinGame.findOne({ gameid: gameId, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}
async function fetchRecordById(id) {
    try {
        const result = await WinGame.findOne({ _id: id, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}
async function fetchRecordByUserId(userID) {
    try {
        const result = await WinGame.find({ user_id: userID, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

async function fetchRecordByUserIdAndType(userID,gameType) {
    try {
        const result = await WinGame.find({ user_id: userID,gameType: gameType, status: 'active', deleted: false });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    insertRecord,
    updateRecord,
    deleteRecordByGameId,
    fetchAllRecords,
    fetchRecordByGameId,
    fetchRecordById,
    fetchRecordByUserId,
    fetchRecordByUserIdAndType,
};
