const numbercolormasters = require('../models/numbercolormasters');

const fetchNumberOnColor = async (req, res) => {
    try {
        const { color } = req.params;

        const oResult = await numbercolormasters.fetchNumberOnColor(color);
        res.status(200).json({ status: 200, message: "successfully", body: oResult });
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const fetchAll = async (req, res) => {
    try {
        const oResult = await numbercolormasters.fetchAll();
        res.status(200).json({ status: 200, message: "successfully", body: oResult });
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    fetchAll,fetchNumberOnColor
};