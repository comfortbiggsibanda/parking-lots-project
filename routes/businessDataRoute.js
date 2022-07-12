const express = require('express');
const BusinessDataController = require('../controllers/businessDataController');

const router = express.Router();

router.post('/upload', BusinessDataController.uploadCsvFile, BusinessDataController.saveToDataBase);

router.get('/parkinglots/:id/cars/:T', BusinessDataController.getAllCarsOnParkinglot)

router.get('/inventory/:T', BusinessDataController.getInventory)


module.exports = router;
