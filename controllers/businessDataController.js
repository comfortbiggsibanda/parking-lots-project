const multer = require('multer');
const sharp = require('sharp');
const BusinessData = require('../models/businessDataModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application/pdf')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a pdf! Please upload only pdfs.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCandidateResume = upload.single('resume');

exports.resizeCandidateResume = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `candidate-${Math.random() * 10000000000000}-${Date.now()}.pdf`;

  await sharp(req.file.buffer)

    .toFile(`public/pdf/candidates/${req.file.filename}`);

  next();
});


exports.createCandidate = factory.createOne(Candidate)
exports.getCandidate = factory.getOne(Candidate, 'evaluations');
exports.getAllCandidates = factory.getAll(Candidate);
exports.deleteCandidate = factory.deleteOne(Candidate);
