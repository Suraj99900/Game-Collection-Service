const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();
const staffController = require('../controllers/staffController');

// Define staff-related routes


router.post('/',staffController.createStaff);
router.post('/otp',staffController.genrateOTP);
router.post('/login',staffController.loginStaff);

router.get('/',staffController.fetchAllStaff);
router.put('/:staffId',staffController.updateStaffById);
router.get('/:staffId',staffController.fetchStaffByStaffId);
router.delete('/:staffId',staffController.deleteStaffById);

module.exports = router;
