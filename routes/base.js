const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseControllers');


router.get('/campanhasBitrixWhats', baseController.appcampanhasBitrixWhats);
router.get('/campanhasSms', baseController.appcampanhasSms);
router.get('/campanhasLojasSms', baseController.appcampanhasLojasSms);
router.get('/teste', baseController.appteste);

module.exports = router