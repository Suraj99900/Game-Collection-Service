const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    client_id: { type: String, required: true, unique: true },
    client_key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    createdOn: { type: Date, default: Date.now },
});

const client = mongoose.model('client', clientSchema);

const fetchClientById = async (sClientId) => {
    try {
        return client.find({'client_id': sClientId})
    }  catch (error) {
        throw error;
    }
}

module.exports = {client,fetchClientById};
