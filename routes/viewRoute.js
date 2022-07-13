const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi there! Feel free to mess around with some of the routes requested for this assessment.')
})

module.exports = router;