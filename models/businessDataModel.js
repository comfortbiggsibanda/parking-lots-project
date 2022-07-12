const mongoose = require('mongoose');

const businessDataSchema = new mongoose.Schema({
    carBrand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true,
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      trim: true,
    },
    parkinglotId: {
      type: String,
      required: [true, 'Parking lot id is required'],
    },
    timeParkedAt: {
      type: String,
      required: [true, 'The time the car was parked at is required'],
    },
    value: {
      type: Number,
      default: 0,
    },
    discountInCents: {
        type: Number,
        default: 0,
      },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const BusinessData = mongoose.model('businessDataSchema', businessDataSchema);

module.exports = BusinessData;
