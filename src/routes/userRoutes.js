const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();
const userController = require('../controllers/userController');
const persnoalBankInfoController = require('../controllers/prsonalBankInfoController');
const reportComplaintsSuggetion = require('../controllers/reportComplainSuggetionController');

// Define user-related routes

router.post('/', userController.createUser);
router.post('/getOTP', userController.genrateOTP);
router.post('/login', userController.loginUser);
router.get('/personal-info/:userId', userController.personalInfo);
router.post('/reset-genrate-otp', userController.resetGenrateOtp);
router.post('/reset-password', userController.updatePassword);


// perfonal bank info
router.post('/persnoal-info/bank',persnoalBankInfoController.addInfo);
router.get('/persnoal-info/bank',persnoalBankInfoController.getAllInfo);
router.get('/persnoal-info/bank/:userId',persnoalBankInfoController.getInfoByUserId);
router.delete('/persnoal-info/bank/:userId',persnoalBankInfoController.invalidUserInfo);
router.put('/persnoal-info/bank',persnoalBankInfoController.updateUserInfo);
router.post('/persnoal-info/bank/bankOTP', persnoalBankInfoController.genrateBankOTP);


// User Report Complain Suggetion

// Include Multer middleware before the controller
router.post('/report-complain', reportComplaintsSuggetion.insertReportComplaint);
router.put('/report-complain/:reportId',reportComplaintsSuggetion.updateReport);
router.get('/report-complain/:iUserID',reportComplaintsSuggetion.getAllReports);
router.get('/report-complain/:reportId',reportComplaintsSuggetion.getReportById);
router.delete('/report-complain/:reportId',reportComplaintsSuggetion.deleteReport);
module.exports = router;
