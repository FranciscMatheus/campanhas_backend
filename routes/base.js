const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseControllers');


router.get('/campanhasBitrixWhats', baseController.appcampanhasBitrixWhats);
router.get('/campanhasSms', baseController.appcampanhasSms);

module.exports = router