const BannerModal = require('../models/banner');
const { ValidationError } = require('../exceptions/errorHandlers');
const fileUpload = require('express-fileupload');
const path = require('path');
const config = require('../config');

const insertBanner = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ status: 400, message: 'No files were uploaded.' });
        }

        const uploadedFile = req.files.file;  // 'file' is the name attribute in the form
        // Use a unique name for the file to avoid conflicts
        const fileName = Date.now() + '-' + uploadedFile.name;

        uploadedFile.mv('D:/InstalledApp/Xampp/htdocs/project/Game-Collection-Service/uploads/' + fileName, async (err) => {
            if (err) {
                return res.status(500).json({ status: 500, message: err });
            }
            const { staff_id, banner_name } = req.body;

            if (!staff_id || !banner_name) {
                return res.status(400).json({ status: 400, message: 'staff_id, banner_name are required' });
            }

            const oResultData = await BannerModal.insertBannerData(staff_id, banner_name, fileName);
            res.status(201).json({ status: 200, message: 'Banner data Inserted successfully', body: oResultData });
        });
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

const fetchAllBannerData = async (req, res) => {
    try {
        const oResultBanner = await BannerModal.fetchAllBannerData();

        const baseUrl = config.URL.BASE_URL;

        const bannerData = oResultBanner.map(banner => ({
            ...banner.toObject(),
            url: `${baseUrl}/uploads/${banner.file}`
        }));

        return res.status(200).json({ status: 200, message: "Fetch operation successful", body: bannerData });
    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            res.status(error.statusCode).json({ status: 500, message: error.message });
        } else {
            res.status(500).json({ status: 500, error: 'Internal Server Error' });
        }
    }
}


const deleteBannerRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ status: 400, message: 'id are required' });
        }
        const oResultBanner = await BannerModal.deleteBannerData(id);
        return res.status(200).json({ status: 200, message: "fetch opration successfully", body: oResultBanner });
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
    insertBanner,
    fetchAllBannerData,
    deleteBannerRecordById
}