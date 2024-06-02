const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.post('/',bannerController.insertBanner);
router.get('/',bannerController.fetchAllBannerData);
router.delete('/:id',bannerController.deleteBannerRecordById);

module.exports = router;