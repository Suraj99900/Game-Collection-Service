const mongoose = require('mongoose');

const numberColorMasterSchema = new mongoose.Schema({
    color: { type: String, required: true },
    numbers: { type: [Number], required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const NumberColorMaster = mongoose.model('numbercolormasters', numberColorMasterSchema);

const createNumberColorMaster = async (data) => {
    try {
        const newRecord = new NumberColorMaster(data);
        await newRecord.save();
        return newRecord;
    } catch (error) {
        throw new Error(`Error creating record: ${error.message}`);
    }
};


const fetchAllNumberColorMasters = async () => {
    try {
        const records = await NumberColorMaster.find({ deleted: false });
        return records;
    } catch (error) {
        throw new Error(`Error fetching records: ${error.message}`);
    }
};

const fetchNumberColorMasterById = async (id) => {
    try {
        const record = await NumberColorMaster.findById(id);
        if (!record || record.deleted) {
            throw new Error('Record not found');
        }
        return record;
    } catch (error) {
        throw new Error(`Error fetching record: ${error.message}`);
    }
};

const updateNumberColorMaster = async (id, data) => {
    try {
        const record = await NumberColorMaster.findByIdAndUpdate(
            id,
            { ...data, updatedOn: Date.now() },
            { new: true, runValidators: true }
        );
        if (!record) {
            throw new Error('Record not found');
        }
        return record;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

const deleteNumberColorMaster = async (id) => {
    try {
        const record = await NumberColorMaster.findByIdAndUpdate(
            id,
            { deleted: true, updatedOn: Date.now() },
            { new: true }
        );
        if (!record) {
            throw new Error('Record not found');
        }
        return record;
    } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
    }
};

const fetchNumberOnColor = async (sColor) => {
    try {
        const oResult = await NumberColorMaster.find({
            color: sColor, deleted: false, status: "active"
        }).sort({ addedOn: -1 });
        return oResult;
    } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
    }
}

const fetchAll = async () => {
    try {
        const oResult = await NumberColorMaster.find({
            deleted: false, status: "active"
        }).sort({ addedOn: -1 });
        return oResult;
    } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
    }
}


module.exports = { fetchAll,createNumberColorMaster, NumberColorMaster, fetchNumberOnColor, fetchAllNumberColorMasters, fetchNumberColorMasterById, updateNumberColorMaster, deleteNumberColorMaster };
