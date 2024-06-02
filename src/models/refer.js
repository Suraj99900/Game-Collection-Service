
const mongoose = require('mongoose');

const referSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    refer_code:{type:String,require:true},
    count: { type: Number,default:0 },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const refercode = mongoose.model('refercode', referSchema);


const insertReferData = async (sReferCode, userId,iCount) => {
    try {
        return refercode.create({
            user_id: userId,
            refer_code: sReferCode,
            count: iCount,
        });
    } catch (error) {
        throw error;
    }
}

const updateReferCode = async (sReferCode, oUpdateFields) => {
    try {
        const operation = await refercode.findOneAndUpdate(
            { refer_code: sReferCode },
            { $set: oUpdateFields },
            { new: true }
        );
        return operation;
    } catch (error) {
        throw error;
    }
}


const fetchAllReferByUserId = async (userId)=>{
    try {
        return refercode.find({ user_id: userId, deleted: false });
    } catch (error) {
        throw error;
    }
}

const fetchAllReferByReferCode = async (sReferCode)=>{
    try {
        return refercode.find({ refer_code: sReferCode, deleted: false });
    } catch (error) {
        throw error;
    }
}
module.exports = { insertReferData, updateReferCode,fetchAllReferByUserId ,fetchAllReferByReferCode};
