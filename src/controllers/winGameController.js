
const { ValidationError } = require('../exceptions/errorHandlers');
const winGameModel = require('../models/winGame');
const UserAmount = require('../models/userAmount');
let countdownTimer = 180; // Initial timer value in seconds
let countdownInterval; // Declare a variable to store the interval

const insertWinGame = async (req, res) => {
    const { type } = req.body;
    try {

        // Validate request data
        if (!type) {
            throw new ValidationError('type are required');
        }

        const colors = ['green', 'violet', 'red'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        let number;

        switch (color) {
            case 'green':
                // Generate random number from [1, 3, 7, 9]
                const greenNumbers = [1, 3, 7, 9];
                number = greenNumbers[Math.floor(Math.random() * greenNumbers.length)];
                break;
            case 'red':
                // Generate random number from [2, 4, 6, 8]
                const redNumbers = [2, 4, 6, 8];
                number = redNumbers[Math.floor(Math.random() * redNumbers.length)];
                break;
            case 'violet':
                // Generate random number from [0, 5]
                const violetNumbers = [0, 5];
                number = violetNumbers[Math.floor(Math.random() * violetNumbers.length)];
                break;
            default:
                break;
        }

        var period = await generateUniqueNumber();
        const insertData = await winGameModel.insertRecord({ period, type, color, number });
        if (insertData) {
            res.status(201).json({ status: 201, message: 'Win Record created successfully', data: insertData });
        } else {
            res.status(500).json({ status: 500, error: 'Error While Inserting Data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
}

const updateWinGame = async (req, res) => {
    const { id } = req.params;
    const { color, number } = req.body;
    // Validate request data
    if (!color || !number) {
        throw new ValidationError('Id, color and number are required');
    }
    const updateData = await winGameModel.updateRecord(id, { color, number });
    if (updateData) {
        res.status(201).json({ status: 200, message: 'Win Record updated successfully', data: updateData });
    } else {
        res.status(500).json({ status: 500, error: 'something wrong.' });
    }
}


const fetchRecordById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ValidationError('id are required');
    }

    aRecordData = await winGameModel.fetchRecordById(id);

    try {
        if (aRecordData) {
            res.status(200).json({ status: 200, message: 'Win Data fetch successfully', data: aRecordData });
        } else {
            res.status(500).json({ status: 500, error: 'Error While Fetching Data' });
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
        if (type != null && type !== "") { // Use && for "and" condition
            aRecordData = await winGameModel.fetchRecordDeletedBywinType(type);
        } else {
            aRecordData = await winGameModel.fetchAllRecords();
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

const fetchLastActiveRecord = async (req, res) => {

    try {
        var aRecordData = await winGameModel.fetchLastActiveRecord();
        

        if (aRecordData) {
            res.status(200).json({ status: 200, message: 'Win Data fetch successfully', data: aRecordData.period });
        } else {
            res.status(200).json({ status: 200,data: '00-00-00' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};


const fecthCountdown = async (req, res) => {
   // const minutes = Math.floor(countdownTimer / 60);
    //const seconds = countdownTimer % 60;

    res.status(200).json({ countdownTimer });
};

const generateUniqueNumber = async (type) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    // check the privous counter
    var aRecord = await winGameModel.fetchLastActiveRecord(type);
    if (!aRecord) {
        var iPeriod = 1;
    } else {
        var iPeriod = aRecord.period;
    }

    // Combine date and counter to generate a unique number
    const uniqueNumber = `${year}${month}${day}${iPeriod}`;

    return uniqueNumber;
}

const startCountdown = async () => {
    // Check if the countdown is already running
    if (!countdownInterval) {
        countdownInterval = setInterval(() => {
            countdownTimer -= 1;

            if (countdownTimer <= 0) {
                console.log('Countdown timer reset to 3 minutes.');
                countdownTimer = 180; // Reset the timer to 3 minutes when it reaches 0
            }
        }, 1000); // Set the interval to 1000 milliseconds (1 second)
    }
};

module.exports = {
    insertWinGame,
    fetchAllRecords,
    updateWinGame,
    fetchRecordById,
    fecthCountdown,
    startCountdown,
    fetchLastActiveRecord,
}