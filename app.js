const express = require('express');
const bodyParser = require('body-parser');
//const path = require('path');
//const fileUpload = require('express-fileupload')




// Start express app
const app = express();

app.use(bodyParser.json());
//app.use(fileUpload)

const businessDataRouter = require('./routes/businessDataRoute');
// // Serving static files
// app.use(express.static(path.join(__dirname, 'csvData')));



app.use('/api/v1/business-data', businessDataRouter);

module.exports = app;