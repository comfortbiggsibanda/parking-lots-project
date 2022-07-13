const express = require('express');
const BusinessDataController = require('../controllers/businessDataController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi there! Feel free to mess around with some of the routes requested for this assessment.')
})

router.post('/upload', BusinessDataController.uploadCsvFile, BusinessDataController.saveToDataBase);

router.get('/parkinglots/:id/cars/:T', BusinessDataController.getAllCarsOnParkinglot)

router.get('/inventory/:T', BusinessDataController.getInventory)


module.exports = router;
