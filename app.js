const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')

const businessDataRouter = require('./routes/businessDataRoute');




// Start express app
const app = express();

//app.use(fileUpload());
app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, 'csvData')));






app.use('/api/v1/business-data', businessDataRouter);

module.exports = app;