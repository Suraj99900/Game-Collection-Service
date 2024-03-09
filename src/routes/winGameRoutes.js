const express = require('express');
const router = express.Router();
const winGameController = require('../controllers/winGameController');
const userWinGameController = require('../controllers/userWinBetController');

// countDown
router.get('/countdown',winGameController.fecthCountdown)

// win period route
router.get('/win-game/period',winGameController.fetchLastActiveRecord);

router.post('/win-game',winGameController.insertWinGame);
router.get('/win-game/type/:type',winGameController.fetchAllRecords);
router.put('/win-game/:id',winGameController.updateWinGame);
router.get('/win-game/id/:id',winGameController.fetchRecordById);

// User Bet Route
router.post('/win-game/userbet',userWinGameController.insertWinUserBet);
router.get('/win-game/userbet',userWinGameController.fetchUserWinRecord);
module.exports = router;