const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();
const referCodeController = require('../controllers/referCodeController');


router.post('/',referCodeController.genrateReferCode);
router.put('/',referCodeController.updateReferCode);
router.get('/:user_id',referCodeController.fetchGenratedCode);


module.exports = router;