const User = require('../models/user');
const { ValidationError } = require('../exceptions/errorHandlers');
const reportModel = require('../models/reportComplaintsSuggetion');
const { RAZORPAY } = require('../config');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');

const insertReportComplaint = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: 400, message: 'No files were uploaded.' });
    }

    const uploadedFile = req.files.file;  // 'file' is the name attribute in the form

    // Use a unique name for the file to avoid conflicts
    const fileName = Date.now() + '-' + uploadedFile.name;

    uploadedFile.mv('D:/InstalledApp/Xampp/htdocs/project/gammingProjectAPI/uploads/' + fileName, async (err) => {
        if (err) {
            return res.status(500).json({ status: 500, message: err });
        }

        // File uploaded successfully, continue with your logic
        const { user_id, type, order_id, email, phone_number, description } = req.body;

        if (!user_id || !type || !phone_number || !email || !description) {
            return res.status(400).json({ status: 400, message: 'User ID, type, phone number, email, and description are required' });
        }

        const reportData = {
            user_id,
            type,
            order_id,
            email,
            phone_number,
            description: description,
            file: fileName,
        };

        const newReport = await reportModel.createReport(reportData);
        res.status(201).json({ status: 200, message: 'Report created successfully', body: newReport });
    });
};





// Function to get all reports
const getAllReports = async (req, res) => {
    try {
        const userID = req.params.iUserID;
        const {iFlag} = req.query;


        if(iFlag == 1){
            var allReports = await reportModel.getAllComplitedReport(userID);
        }else if(iFlag == 2){
            var allReports = await reportModel.getAllActiveReport(userID);
            console.log(allReports);
        }else{
            var allReports = await reportModel.getAllReports(userID);
        }
      
        res.json({ status: 200, message: 'Reports retrieved successfully', body: allReports });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

// Function to get a specific report by ID
const getReportById = async (req, res) => {
    try {
        const report = await reportModel.getReportById(req.params.reportId);
        res.json({ status: 200, message: 'Report retrieved successfully', body: report });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

// Function to get reports by user ID
const getReportsByUserId = async (req, res) => {
    try {
        const reports = await reportModel.getReportsByUserId(req.params.userId);
        res.json({ status: 200, message: 'Reports retrieved successfully', body: reports });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

// Function to update a specific report by ID
const updateReport = async (req, res) => {
    try {
        const updatedReport = await reportModel.updateReport(req.params.reportId, req.body);
        res.json({ status: 200, message: 'Report updated successfully', body: updatedReport });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

// Function to soft delete a report by marking it as deleted
const deleteReport = async (req, res) => {
    try {
        const deletedReport = await reportModel.deleteReport(req.params.reportId);
        res.json({ status: 200, message: 'Report deleted successfully', body: deletedReport });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    insertReportComplaint,
    getAllReports,
    getReportById,
    getReportsByUserId,
    updateReport,
    deleteReport,
};
