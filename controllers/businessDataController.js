const multer = require('multer');
const sharp = require('sharp');
const BusinessData = require('../models/businessDataModel');
const CsvFile = require('../csvData/csvFileLoad');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
//const fileUpload = require('express-fileupload')

const fs = require('fs'); 
const { parse } = require('csv-parse');


//logic to handle csv file uploads 
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'csvData/csvFiles');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `myParkingLotData.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.includes('csv')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload a csv file.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});



const saveToDataBase = async (req, res) => {
  //loading, reading and saving file details to database
  const parser = parse({columns: true, delimiter: ';'}, async function (err, records){
    console.log(records);

      try {
          await BusinessData.create(records);
          console.log('Data successfully loaded!');
        } catch (err) {
          console.log(err);
        }
  });

  fs.createReadStream(__dirname + `/csvData/csvFiles/${req.file.originalname}`).pipe(parser);
}

exports.uploadCsvFile = upload.single('file');

// exports.createCandidate = factory.createOne(Candidate)
// exports.getCandidate = factory.getOne(Candidate, 'evaluations');
// exports.getAllCandidates = factory.getAll(Candidate);
// exports.deleteCandidate = factory.deleteOne(Candidate);
