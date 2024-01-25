const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user-related routes

router.post('/', userController.createUser);
router.post('/getOTP', userController.genrateOTP);
router.post('/login', userController.loginUser);
router.get('/personal-info/:userId', userController.personalInfo);
// Add more routes as needed

module.exports = router;
