const cron = require('node-cron');

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running the task every minute');
    // Example usage
    const generatedNumber = generateUniqueNumber();
    console.log(generatedNumber);
});


function winParity() {

}


// Assuming you have a counter stored somewhere, for example in a database
let counter = 0;

function generateUniqueNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    // Increment the counter
    counter++;

    // Combine date and counter to generate a unique number
    const uniqueNumber = `${year}${month}${day}${counter}`;

    return uniqueNumber;
}


