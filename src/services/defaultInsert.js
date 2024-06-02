const mongoose = require('mongoose');
const TransactionType = require('../models/transactionType'); // Adjust the path as needed
const Client = require('../models/client');
const NumberColorMaster = require('../models/numbercolormasters');
const crypto = require('crypto');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gpm', { useNewUrlParser: true, useUnifiedTopology: true });

// Function to seed default transaction types
const seedTransactionTypes = async () => {
    try {

        // Check if there are existing entries
        const count = await TransactionType.countDocuments();
        if (count === 0) {
            // Insert default entries
            const defaultTransactionTypes = [
                { type_id: 1, name: 'Deposit', description: 'Money deposited into the account' },
                { type_id: 2, name: 'Withdrawal', description: 'Money withdrawn from the account' },
                // Add more default entries as needed
            ];

            await TransactionType.insertMany(defaultTransactionTypes);
            console.log('Default TransactionTypes seeded successfully.');
        } else {
            console.log('TransactionTypes already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding TransactionTypes:', error);
    }
};

const clientGenrate = async () => {
    try {
        // Connect to MongoDB
        mongoose.connect('mongodb://localhost:27017/gpm', { useNewUrlParser: true, useUnifiedTopology: true });

        // Check if the Client is already present or not
        const existingClient = await Client.fetchClientByName('Admin'); // Update the condition as needed

        if (existingClient.length === 0) {
            // Generate a 32-bit hash for the client_key (you can use a library for hashing)
            const client_key = generate32BitHash('Temp@123'); // Replace with your actual hashing logic

            // Generate a 4-bit client_id (you can customize the logic as needed)
            const client_id = generateClientID();

            // Other client details
            const name = 'Admin';
            const description = 'Auto Genrate Row';

            // Create the client document
            const newClient = Client.insertClient({
                client_id: client_id.toString(), // Convert client_id to string
                client_key,
                name,
                description,
            });

            // Save the client to the database
            await newClient.save();

            console.log('Client generated successfully.');
        } else {
            console.log('Client already exists. Skipping generation.');
        }
    } catch (error) {
        console.error('Error generating client:', error);
    }
};

// Function to generate a 32-bit hash
const generate32BitHash = (data) => {
    // Use a cryptographic hash function (e.g., SHA-256)
    const hash = crypto.createHash('sha256');

    // Update the hash with the data
    hash.update(data);

    // Get the hash in hexadecimal format
    const hexHash = hash.digest('hex');

    // Return the first 32 characters (32-bit hash)
    return hexHash.substring(0, 32);
};


// Function to generate a 4-character client_id
const generateClientID = () => {
    // const randomNumericPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const randomAlphaNumericPart = generateRandomAlphaNumeric(4);
    return randomAlphaNumericPart;
};

const generateRandomAlphaNumeric = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};

// Function to seed default number color masters
const seedNumberColorMasters = async () => {
    try {
        // Check if there are existing entries
        const count = await NumberColorMaster.fetchAllNumberColorMasters();
        if (count.length === 0) {
            // Insert default entries
            const defaultNumberColorMasters = [
                { color: 'green', numbers: [1, 3, 7, 9], status: 'active', deleted: false, addedOn: new Date("2024-03-20T15:54:45.300Z") },
                { color: 'red', numbers: [2, 4, 6, 8], status: 'active', deleted: false, addedOn: new Date("2024-03-20T15:54:45.316Z") },
                { color: 'violet', numbers: [0, 5], status: 'active', deleted: false, addedOn: new Date("2024-03-20T15:54:45.323Z") }
            ];
            defaultNumberColorMasters.forEach(async aData => {
                console.log(aData);
                await NumberColorMaster.createNumberColorMaster(aData);
            });
           
            console.log('Default NumberColorMasters seeded successfully.');
        } else {
            console.log('NumberColorMasters already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding NumberColorMasters:', error);
    }
};


// Seed default transaction types
seedTransactionTypes();

clientGenrate();
// Seed default number color masters
seedNumberColorMasters();

setTimeout(() => {
    mongoose.connection.close();
}, 2000);
