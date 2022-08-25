var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/moo', function(req, res, next) {
  res.json({"Cow": "MooOoooooOOOOo, moo."});
});

module.exports = router;
