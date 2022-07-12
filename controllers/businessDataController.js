const multer = require('multer');
const BusinessData = require('../models/businessDataModel');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
//const fileUpload  = require('express-fileupload')


const fs = require('fs'); 
const { parse } = require('csv-parse');


//multer logic to handle csv file uploads 
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


//saving csv file contents to Mongo database
const saveToDataBase = async (req, res) => {

  const parser = parse({columns: true, delimiter: ';'}, async function (err, records){

      try {
          await BusinessData.create(records);
          console.log('Data successfully loaded!');
        } catch (err) {
          console.log(err);
        }
  });

  req.file.originalname = 'myParkingLotData.csv'

  let pathToFile = path.join(__dirname, '..', 'csvData', 'csvFiles', `${req.file.filename}`)

  fs.createReadStream(pathToFile).pipe(parser);

  res.status

  // SENDING RESPONSE
  res.status(201).json({
    status: 'success',
    message: 'CSV file contents successfully saved to database!',
  });
}

// getting all cars in a particular parking lot
 const getAllCarsOnParkinglot = catchAsync(async (req, res, next) => {

    let parkinglotId = req.params.id.toString();

    let filter = {parkinglotId};
    //if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(BusinessData.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
     
    });
  });

exports.uploadCsvFile = upload.single('file');
exports.saveToDataBase = saveToDataBase;
exports.getAllCarsOnParkinglot = getAllCarsOnParkinglot;

// exports.createCandidate = factory.createOne(Candidate)
// exports.getCandidate = factory.getOne(Candidate, 'evaluations');
// exports.getAllCandidates = factory.getAll(Candidate);
// exports.deleteCandidate = factory.deleteOne(Candidate);
