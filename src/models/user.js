const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

const createUser = async (username,phoneNumber,hashedPassword,status = 'active',deleted = false)=>{
    return new User({
        username,
        phoneNumber,
        password: hashedPassword,
        status: status || 'active',
        deleted: deleted || false,
    });
};

module.exports = {User,fetchUserByUserId,fetchUserByPhoneNumber,checkUserExist,createUser};
