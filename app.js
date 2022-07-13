const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const businessDataRouter = require('./routes/businessDataRoute');
const viewRouter = require('./routes/viewRoute');


// Start express app
const app = express();

app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, 'csvData')));

app.use('/', viewRouter);
app.use('/api/v1/business-data', businessDataRouter);

module.exports = app;