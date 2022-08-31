var express = require('express');
var router = express.Router();
//var router = require('express-promise-router')()

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'https://pkzscplmxataclyrehsr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrenNjcGxteGF0YWNseXJlaHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAzNTg4NTksImV4cCI6MTk3NTkzNDg1OX0.o08ahJ-vSqgwZVLF1DGzRgm8oCuSV-5WlGJinuTj4PA'
)

/* GET users listing. */
router.get('/moo', function(req, res, next) {
  res.json({"Cow": "MooOoooooOOOOo, moo."});
});

router.get('/marshflitter', async function(req, res, next) {

  let { data, error } = await supabase
  .from('mtg_cards_master')
  .select('*')
  .eq('id', '64da2ec1-fca9-4488-8ac7-78d645a8bf62');

  if (error) {
    console.log(error)
    return
  }

  console.log(data);

  res.json(data[0]);

});

router.post('/search/query=:queryText', async function(req, res, next) {

  let { data, error } = await supabase
  .from('mtg_cards_master')
  .select('*')
  .textSearch('name', "'" + req.params.queryText + "'");

  if (error) {
    console.log(error)
    return
  }

  console.log(data);

  res.json(data);

});

module.exports = router;
