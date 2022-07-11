const BusinessData = require('../models/businessDataModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const fs = require('fs'); 
const { parse } = require('csv-parse');

dotenv.config({ path: './config.env' });

//connecting to database
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));


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

fs.createReadStream(__dirname+'/dummyFile.csv').pipe(parser);