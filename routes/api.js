// Imports
const adminRequests = require('../requests/administrative.js')

// Routing Setup
var express = require('express');
var router = express.Router();

router.use('/features', require('./api/features'))
router.use('/search', require('./api/search'))
router.use('/get', require('./api/get'))


// Administrative Calls
router.post('/administrative', async function (req, res, next) {

  res.json(await adminRequests.handleAdmin(req))

});


// Must ALWAYS Be At The Bottom
module.exports = router;