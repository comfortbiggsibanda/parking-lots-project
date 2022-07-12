const express = require('express');
const BusinessDataController = require('../controllers/businessDataController');
const fileUpload = require('express-fileupload')

const router = express.Router();

router.post('/upload', BusinessDataController.uploadCsvFile, (req, res) => {

    res.send('hi there')
} );

// router
//   .route('/')
//   .get(candidateController.getAllCandidates)

// router
//   .route('/:id')
//   .get(candidateController.getCandidate)
//   .delete(candidateController.deleteCandidate);

module.exports = router;
