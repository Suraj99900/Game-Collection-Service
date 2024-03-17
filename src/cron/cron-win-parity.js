const cron = require('node-cron');
const winGameModel = require('../models/winGame');
const winUserBetModel = require('../models/winUserBet');
const gameWinner = require('../models/gameWinner');
const UserAmount = require('../models/userAmount');
const winGameController = require('../controllers/winGameController');


// Schedule a task to run every three minutes
cron.schedule('*/3 * * * *', async () => {
    console.log('Running the task every three minutes');
    // winGameController.countdownTimer = 180;
    winGameController.startCountdown();

    try {
        const defaultEntries = [
            { type: "parity" },
            { type: "sapre" },
            { type: "bcone" },
            { type: "emerd" }
        ];
        const period = await generateUniqueNumber();
        for (const entry of defaultEntries) {
            await insertDefaultEntry(entry.type, period);
        }

        console.log('Default entries created successfully');
        // Schedule a task to decide the winner when 30 seconds are left before the next cron entry
        setTimeout(() => {
            scheduleDecideWinner(period);
        }, 175000);

    } catch (error) {
        console.error('Error while inserting default entries:', error);
    }
});

async function insertDefaultEntry(type, period) {

    const color = getRandomColor();
    const number = getRandomNumber(color);

    await winGameModel.insertRecord({ period, type, color, number });
}

function getRandomColor() {
    const colors = ['green', 'violet', 'red'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomNumber(color) {
    switch (color) {
        case 'green':
            return getRandomFromArray([1, 3, 7, 9]);
        case 'red':
            return getRandomFromArray([2, 4, 6, 8]);
        case 'violet':
            return getRandomFromArray([0, 5]);
        default:
            return 0;
    }
}

function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Initialize the counter and last generated date
let counter = 0;
let lastGeneratedDate = getCurrentDate();

async function generateUniqueNumber() {
    const currentDate = new Date();
    const currentDateString = getCurrentDate();
    const lastActiveRecord = await winGameModel.fetchLastInActiveRecord();

    // Check if the current date is different from the last generated date
    if (currentDateString !== lastGeneratedDate && !lastActiveRecord) {
        // If the date has changed, reset the counter to 1
        counter = 1;
        lastGeneratedDate = currentDateString;
    } else if (lastActiveRecord) {
        var iPeriod = lastActiveRecord.period;
        var remainingNumber = iPeriod.toString().substring(6);
        // Increment the counter if the date is the same
        counter = parseInt(remainingNumber, 10) + 1;
    }

    // Combine date and counter to generate a unique number
    const uniqueNumber = `${currentDateString}${counter}`;

    return uniqueNumber;
}


// Helper function to get the current date in the format YYYYMMDD
function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    return `${year}${month}${day}`;
}


async function scheduleDecideWinner(period) {
    // Schedule a task to decide the winner when 30 seconds are left before the next cron entry

    console.log('Running the task when 30 seconds are left before the next cron entry');

    const gameTypes = ["parity", "sapre", "bcone", "emerd"];

    for (const type of gameTypes) {
        try {
            const winGameRecord = await winGameModel.fetchRecordBywinTypeAndPeriod(type, period);
            const userWinRecords = await winUserBetModel.fetchRecordByTypePeriod(type, period);
            console.log(winGameRecord);
            for (const userRecord of userWinRecords) {
                if (userRecord.period === winGameRecord.period && userRecord.type === winGameRecord.type) {
                    if (userRecord.color === winGameRecord.color) {
                        let iAmount;

                        switch (userRecord.color) {
                            case "green":
                                iAmount = (userRecord.number === winGameRecord.number) ? userRecord.amount * 9 : userRecord.amount * 2;
                                break;
                            case "red":
                                iAmount = (userRecord.number === winGameRecord.number) ? userRecord.amount * 9 : userRecord.amount * 2;
                                break;
                            case "violet":
                                iAmount = (userRecord.number === winGameRecord.number) ? userRecord.amount * 9 : userRecord.amount * 4.5;
                                break;
                            default:
                                break;
                        }

                        const oData = {
                            "gameid": userRecord._id,
                            "gameType": "win",
                            "winAmount": iAmount,
                            "type": userRecord.type,
                            "color": userRecord.color,
                            "amount": userRecord.amount,
                            "user_id": userRecord.user_id,
                            "number": userRecord.number,
                        };

                        const userAmountDetails = await UserAmount.currentBalanceByUserId(userRecord.user_id);

                        if (userAmountDetails) {
                            const InvalidResult = await UserAmount.invalidateUserAmount(userRecord.user_id);

                            if (InvalidResult) {
                                const newAmount = parseInt(userAmountDetails.available_amount, 10) + parseInt(iAmount, 10);
                                const userAmountData = {
                                    user_id: userRecord.user_id,
                                    available_amount: newAmount,
                                    value: iAmount,
                                    transaction_type: 1,
                                };

                                const userAmount = await UserAmount.insertUserAmount(userAmountData);
                                await userAmount.save();
                            }
                        }

                        const oUpdateResult = await winUserBetModel.updateRecord(userRecord._id, { isWin: true });
                        const oResult = await gameWinner.insertRecord(oData);
                    }
                }
            }
            console.log(winGameRecord._id);
           await winGameModel.deleteRecordByRecordID(winGameRecord._id);
        } catch (error) {
            console.error(`Error in scheduleDecideWinner for type ${type}:`, error);
        }
    }

}


