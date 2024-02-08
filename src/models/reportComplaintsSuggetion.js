const mongoose = require('mongoose');

const reportComplaintsSuggestionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    type: { type: String, required: true },
    order_id: { type: String },
    email: { type: String },
    phone_number: { type: String },
    description: { type: String },
    file: { type: String },  // Add the file path field
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const Report = mongoose.model('report', reportComplaintsSuggestionSchema);

// Create operation
async function createReport(reportData) {
    try {
        const newReport = await Report.create(reportData);
        return newReport;
    } catch (error) {
        throw error;
    }
}

// Read operation - Get all reports
async function getAllReports(userID) {
    try {
        const allReports = await Report.find({ user_id: userID, deleted: false });
        return allReports;
    } catch (error) {
        throw error;
    }
}

// Read Opration - Get Active Report
async function getAllActiveReport(userID) {
    try {
        const oActiveReports = await Report.find({ user_id: userID, status: 'active', deleted: false });
        return oActiveReports;
    } catch (error) {
        throw error;
    }
}

// Read Opration - Get Complited Report

async function getAllComplitedReport(userID) {
    try {
        const oComplitedReports = await Report.find({ user_id: userID, status: 'complited', deleted: false });
        return oComplitedReports;
    } catch (error) {
        throw error;
    }
}

// Read operation - Get a specific report by ID
async function getReportById(reportId) {
    try {
        const report = await Report.findOne({ _id: reportId, status: 'active', deleted: false });
        return report;
    } catch (error) {
        throw error;
    }
}

// Read operation - Get reports by user ID
async function getReportsByUserId(userId) {
    try {
        const reports = await Report.find({ user_id: userId, status: 'active', deleted: false });
        return reports;
    } catch (error) {
        throw error;
    }
}

// Update operation - Update a specific report by ID
async function updateReport(reportId, updatedData) {
    try {
        const updatedReport = await Report.findByIdAndUpdate(reportId, updatedData, { new: true });
        return updatedReport;
    } catch (error) {
        throw error;
    }
}

// Delete operation - Soft delete a report by marking it as deleted
async function deleteReport(reportId) {
    try {
        const deletedReport = await Report.findByIdAndUpdate(reportId, { deleted: true }, { new: true });
        return deletedReport;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    getReportsByUserId,
    updateReport,
    deleteReport,
    getAllActiveReport,
    getAllComplitedReport
};
