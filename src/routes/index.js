const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');

// Include user routes
router.use('/users', userRoutes);
// Add more route modules as needed

module.exports = router;
