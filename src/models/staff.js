const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    staffname: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },

});

const Staff = mongoose.model('Staff', StaffSchema);

const fetchStaffByStaffId = async (StaffId = '') => {
    return Staff.findOne({
        _id: StaffId,
        status: 'active',
        deleted: false,
    });
};

const fetchStaffByPhoneNumber = async (sPhoneNumber) => {
    return Staff.findOne({
        phoneNumber: sPhoneNumber,
        status: 'active',
        deleted: false,
    });
};

const checkStaffExist = async (sPhoneNumber) => {
    return Staff.exists({ phoneNumber: sPhoneNumber });
};

const createStaff = async (staffname, phoneNumber, hashedPassword, status = 'active', deleted = false) => {
    return new Staff({
        staffname,
        phoneNumber,
        password: hashedPassword,
        status: status || 'active',
        deleted: deleted || false,
    });
};

const updateStaff = async (StaffId, updatedFields) => {
    try {
        const oStaff = await Staff.findOneAndUpdate(
            { _id: StaffId, status: 'active', deleted: false },
            { $set: { ...updatedFields }, updatedOn: new Date() },
            { new: true }
        );

        return oStaff;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const fetchAllStaff = async () => {
    try {
        const oStaff = await Staff.find({ status: 'active', deleted: false });
        return oStaff;
    } catch (error) {
        throw (error)
    }
}

const invalidStaffByID = async (StaffId) => {
    try {
        const oStaff = await Staff.updateOne({
            status: "active", deleted: false, _id: StaffId
        }, {
            $set: { deleted: true }, updatedOn: new Date()
        }, {
            new: true
        }
        );

        return oStaff;
    } catch (error) {
        throw (error);
    }
}

module.exports = { Staff, fetchStaffByStaffId, fetchStaffByPhoneNumber, checkStaffExist, createStaff, updateStaff, fetchAllStaff,invalidStaffByID };
