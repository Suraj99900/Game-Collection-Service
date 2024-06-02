const { ValidationError } = require("../exceptions/errorHandlers");
const refercodeModal = require("../models/refer");
const crypto = require('crypto');

const genrateReferCode = async (req, res) => {
    try {
        const { user_id } = req.body;
        // Validate request data
        if (!user_id) {
            throw new ValidationError('user_id are required');
        }
        const sUserId = user_id;
        const sCode = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);

        // check code already code genrated or not 
        const oAlreadyCodeData = refercodeModal.fetchAllReferByUserId(sUserId);

        if (oAlreadyCodeData) {
            const oResult = refercodeModal.insertReferData(sCode, sUserId, 0);

            if (oResult) {
                res.status(200).json({ status: 200, message: "referCode Genrated", body: oResult });
            }
        } else {
            throw new error('code already genrated..');
        }

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

const fetchGenratedCode = async (req, res) => {
    try {
        const { user_id } = req.params;
        // Validate request data
        if (!user_id) {
            throw new ValidationError('user_id are required');
        }


        const oUserCodeRefer = await refercodeModal.fetchAllReferByUserId(user_id);
        console.log(oUserCodeRefer);
        res.status(200).json({ status: 200, message: "referCode fetch", body: oUserCodeRefer });
    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}


const updateReferCode = async (req, res) => {
    try {

        const { refer_code } = req.body;
        // Validate request data
        if (!refer_code) {
            throw new ValidationError('user_id are required');
        }

        // fetchUserReferData By ReferCode
        const oReferFetchData = refercodeModal.fetchAllReferByReferCode(refer_code);
        if (oReferFetchData) {
            throw new ValidationError('No data are found from this refer code');
        }
        const aData = {
            "count": oReferFetchData.count + 1,
        };

        const oUpdateResult = refercodeModal.updateReferCode(refer_code, aData);

        res.status(200).json({ status: 200, message: "Refer count upadted... ", body: oUpdateResult });

    } catch (error) {
        console.error(error);

        // Handle specific validation error
        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            // Generic error handling
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}

module.exports = {
    fetchGenratedCode,
    genrateReferCode,
    updateReferCode
}