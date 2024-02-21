const express = require('express');
const router = express.Router();
const winGameController = require('../controllers/winGameController');

router.post('/win-game',winGameController.insertWinGame);
router.get('/win-game/:type',winGameController.fetchAllRecords);

module.exports = router;