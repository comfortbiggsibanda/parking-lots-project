const express = require('express');
const BusinessDataController = require('../controllers/businessDataController');
//const fileUpload  = require('express-fileupload')

const router = express.Router();

router.post('/upload', BusinessDataController.uploadCsvFile, BusinessDataController.saveToDataBase);

router.get('/parkinglots/:id/cars/', BusinessDataController.getAllCarsOnParkinglot)

// router
//   .route('/')
//   .get(candidateController.getAllCandidates)

// router
//   .route('/:id')
//   .get(candidateController.getCandidate)
//   .delete(candidateController.deleteCandidate);

module.exports = router;
