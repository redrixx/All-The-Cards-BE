// Initial Setup
var express = require('express');
var router = express.Router();


// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'https://pkzscplmxataclyrehsr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrenNjcGxteGF0YWNseXJlaHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAzNTg4NTksImV4cCI6MTk3NTkzNDg1OX0.o08ahJ-vSqgwZVLF1DGzRgm8oCuSV-5WlGJinuTj4PA'
)


// Table References
const atcMaster = 'atc_cards_master'
const decksMaster = 'atc_decks_master'
const deckMaster = 'atc_deck_master'


// Basic Card Search Query
// 
// Returns: id, name, image_uris
router.post('/search/card/query=:queryCard', async function(req, res, next) {

  let { data, error } = await supabase
  .from(atcMaster)
  .select('id, name, image_uris')
  .ilike('name', '%' + req.params.queryCard + '%')

  if (error) {
    console.log(error)
    return
  }

  res.json(data)

});


// Basic Deck Search Query
// 
// Returns: id, name, image_uris
router.post('/search/deck/query=:queryDeck', async function(req, res, next) {

  let { data, error } = await supabase
  .from(deckMaster)
  .select()
  .ilike('name', '%' + req.params.queryDeck + '%')

  if (error) {
    console.log(error)
    return
  }

  res.json(data)

});


// Card ID Query
// 
// Returns: Entire Card Object
router.post('/get/card/id=:cardID', async function(req, res, next) {

  let { data, error } = await supabase
  .from(atcMaster)
  .select()
  .eq('id', req.params.cardID)

  if (error) {
    console.log(error)
    return
  }

  res.json(data)

});


// Deck ID Query
// 
// Returns: Array of Entire Card Objects
router.post('/get/deck/id=:deckID', async function(req, res, next) {

  const results = []

  let { data, error } = await supabase
  .from(decksMaster)
  .select()
  .eq('deck_id', req.params.deckID)

  if (error) {
    console.log(error)
    return
  }

  for (let i = 0; i < data.length; i++){
    await getCards(data[i].card_id, results);
  }

  res.json(results)

});


// Helper Function For Getting Deck Cards
async function getCards(cardID, results){

  let { data, error } = await supabase
  .from(atcMaster)
  .select()
  .eq('id', cardID)

  if (error) {
    console.log(error)
    return
  }

  results.push(data[0])

}

// Must ALWAYS Be At The Bottom
module.exports = router;