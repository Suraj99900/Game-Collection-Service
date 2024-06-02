const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refercode :{type:String,require: true},
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
    // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

const fetchUserByUserId = async (userId = '')=>{
    return User.findOne({
        _id: userId,
        status: 'active',
        deleted: false,
    });
};

const  fetchUserByPhoneNumber = async (sPhoneNumber)=>{
    return User.findOne({
        phoneNumber: sPhoneNumber,
        status: 'active',
        deleted: false,
    });
};

const checkUserExist = async (sPhoneNumber)=>{
    return User.exists({ phoneNumber: sPhoneNumber });
};

const createUser = async (username,phoneNumber,hashedPassword,sReferCode = "",status = 'active',deleted = false)=>{
    return new User({
        username,
        phoneNumber,
        password: hashedPassword,
        refercode:sReferCode,
        status: status || 'active',
        deleted: deleted || false,
    });
};

const updateUser = async (userId, updatedFields) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId, status: 'active', deleted: false },
            { $set: { ...updatedFields }, updatedOn: new Date() },
            { new: true }
        );

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const fetchTotalUser = async ()=>{
    try {
        return await User.find({status:'active',deleted :false});
    } catch (error) {
        throw(error)
    }
}

module.exports = {User,fetchUserByUserId,fetchUserByPhoneNumber,checkUserExist,createUser,updateUser,fetchTotalUser};
