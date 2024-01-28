const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const persnoalBankInfoController = require('../controllers/prsonalBankInfoController');

// Define user-related routes

router.post('/', userController.createUser);
router.post('/getOTP', userController.genrateOTP);
router.post('/login', userController.loginUser);
router.get('/personal-info/:userId', userController.personalInfo);


// perfonal bank info
router.post('/persnoal-info/bank',persnoalBankInfoController.addInfo);
router.get('/persnoal-info/bank',persnoalBankInfoController.getAllInfo);
router.get('/persnoal-info/bank/:userId',persnoalBankInfoController.getInfoByUserId);
router.delete('/persnoal-info/bank/:_id',persnoalBankInfoController.invalidUserInfo);
router.put('/persnoal-info/bank',persnoalBankInfoController.updateUserInfo);

module.exports = router;
