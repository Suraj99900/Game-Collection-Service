const mongoose = require('mongoose');

const transactionTypeSchema = new mongoose.Schema({
    type_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    createdOn: { type: Date, default: Date.now },
});

const TransactionType = mongoose.model('TransactionType', transactionTypeSchema);

module.exports = TransactionType;
