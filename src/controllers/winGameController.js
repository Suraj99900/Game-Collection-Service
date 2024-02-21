
const { ValidationError } = require('../exceptions/errorHandlers');
const winGameMoal = require('../models/winGame');


const insertWinGame = async (req, res) => {
    const { type, color, number } = req.body;
    try {

        // Validate request data
        if (!type || !color || !number) {
            throw new ValidationError('type , color , number are required');
        }
        var period = await generateUniqueNumber();
        const newFailOrder = await winGameMoal.insertRecord({ period, type, color, number });
        if (newFailOrder) {
            res.status(201).json({ status: 201, message: 'Win Record created successfully', data: newFailOrder });
        } else {
            res.status(500).json({ status: 500, error: 'Error While Inserting Data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
}


const fetchAllRecords = async (req, res) => {
    const { type } = req.params; // Use req.params instead of req.param
    try {
        var aRecordData;
        console.log(type);
        if (type != null && type !== "") { // Use && for "and" condition
            aRecordData = await winGameMoal.fetchRecordBywinType(type);
        } else {
            aRecordData = await winGameMoal.fetchAllRecords();
        }

        if (aRecordData) {
            res.status(200).json({ status: 200, message: 'Win Data fetch successfully', data: aRecordData });
        } else {
            res.status(500).json({ status: 500, error: 'Error While Fetching Data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

const generateUniqueNumber = async (type) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    // check the privous counter
    var aRecord = await winGameMoal.fetchLastActiveRecord(type);
    if (!aRecord) {
        var iPeriod = 1;
    } else {
        var iPeriod = aRecord.period;
    }

    // Combine date and counter to generate a unique number
    const uniqueNumber = `${year}${month}${day}${iPeriod}`;

    return uniqueNumber;
}


module.exports = {
    insertWinGame,
    fetchAllRecords,
}