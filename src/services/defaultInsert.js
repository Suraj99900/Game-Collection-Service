const mongoose = require('mongoose');
const TransactionType = require('../models/transactionType'); // Adjust the path as needed

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
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Seed default transaction types
seedTransactionTypes();
