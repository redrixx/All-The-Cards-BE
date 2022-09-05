// Initial Setup
var express = require('express');
var router = express.Router();


// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.API_KEY
)


// Table References
const atcMaster = 'atc_cards_master'
const decksMaster = 'atc_decks_master'
const deckMaster = 'atc_deck_master'


// Basic Card Search Query
// 
// Returns: id, name, image_uris
router.post('/search/card/query=:queryCard', async function(req, res, next) {
  
  const results = []

  let { data, error } = await supabase
  .from(atcMaster)
  .select('id, name, image_uris, set_shorthand, color_identity')
  .ilike('name', '%' + req.params.queryCard + '%')

  results[0] = data

  if (error) {
    console.log(error)
    return
  }

  if(data.length === 0){
    await requery(req.params.queryCard, results)
  }

  res.json(results[0])

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

  // Since card_faces was proving time and time again to fail, this will grab the entry via Scryfall's API.
  const fetch = require('node-fetch');
  let url='https://api.scryfall.com/cards/' + req.params.cardID
  let settings = { method: "Get" };

  await fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      data[0].card_faces = json.card_faces
  });

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

  res.json({deck_id: data[0].deck_id, name: data[0].name, cover_art: data[0].cover_art, user_id: data[0].user_id, cards: results})

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

  // Since card_faces was proving time and time again to fail, this will grab the entry via Scryfall's API.
  const fetch = require('node-fetch');
  let url='https://api.scryfall.com/cards/' + cardID
  let settings = { method: "Get" };

  await fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      data[0].card_faces = json.card_faces
  });

  results.push(data[0])

}


// Helper Function For Getting A ReQuery
async function requery(cardName, results){

  let newQuery = cardName.substring(0, cardName.length - 1) + '\'s'
  let { data, error } = await supabase
  .from(atcMaster)
  .select('id, name, image_uris, set_shorthand, color_identity')
  .ilike('name', '%' + newQuery + '%')

  if (error) {
    console.log(error)
    return
  }

  results[0] = data

}


// Must ALWAYS Be At The Bottom
module.exports = router;