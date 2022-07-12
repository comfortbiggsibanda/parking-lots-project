const multer = require('multer');
const BusinessData = require('../models/businessDataModel');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


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

  // SENDING RESPONSE
  res.status(201).json({
    status: 'success',
    message: 'CSV file contents successfully saved to database!',
  });
}

// getting all cars in a particular parking lot
 const getAllCarsOnParkinglot = catchAsync(async (req, res, next) => {

    let parkinglotId = req.params.id.toString();
    let timeElapsed = parseInt(req.params.T);

    let costPerHour = 1.20;
    let discount = 0.10;
    let totalCost;
    let discountToCents = 0;

    if(timeElapsed < 4)
    {
      totalCost = (timeElapsed * costPerHour).toFixed(2);
    } else if(timeElapsed > 3)
    {
      let hourDifference = timeElapsed - 3;
      discount *= hourDifference;
      discountToCents = (discount * 100).toFixed(2);
      totalCost = (timeElapsed * costPerHour) - discount;
    }

    let filter = {parkinglotId};

    await BusinessData.updateMany({}, {$set: {value: totalCost, discountInCents: discountToCents}})

    const features = new APIFeatures(BusinessData.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
 
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


  // getting all the money a user is making across all parking lots
 const getInventory = catchAsync(async (req, res, next) => {

  let timeElapsed = parseInt(req.params.T);

  let costPerHour = 1.20;
  let discount = 0.10;
  let totalCost;
  let discountToCents = 0;

  if(timeElapsed < 4)
  {
    totalCost = (timeElapsed * costPerHour).toFixed(2);
  } else if(timeElapsed > 3)
  {
    let hourDifference = timeElapsed - 3;
    discount *= hourDifference;
    discountToCents = (discount * 100).toFixed(2);
    totalCost = (timeElapsed * costPerHour) - discount;
  }

  await BusinessData.updateMany({}, {$set: {value: totalCost, discountInCents: discountToCents}})

  let inventory = await BusinessData.aggregate( [
    {
       $match: {}
    },
    
    {
       $group: { _id: "$value", value: { $sum: "$value" } }
    }
 ] )

  let filter = {};

  const features = new APIFeatures(BusinessData.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    totalAmountOfCars: doc.length,
    data: {
      data: inventory
    }
   
  });
});

exports.uploadCsvFile = upload.single('file');
exports.saveToDataBase = saveToDataBase;
exports.getAllCarsOnParkinglot = getAllCarsOnParkinglot;
exports.getInventory = getInventory;
