const express = require('express');
const router = express.Router();
const winGameController = require('../controllers/winGameController');
const userWinGameController = require('../controllers/userWinBetController');
const colorNumberController = require('../controllers/colorNumberController');

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
router.get('/win-game/userbet/loss',userWinGameController.fetchUserLossRecord);
router.get('/win-game/userbet/win-loss',userWinGameController.fetchWinLossRecord);

// admin wingame logic route

router.get('/admin/win-game/',userWinGameController.fetchWinGameActiveTableData);

router.get('/color/:color',colorNumberController.fetchNumberOnColor);
router.get('/color',colorNumberController.fetchAll);

module.exports = router;