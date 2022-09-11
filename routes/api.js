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
const usersMaster = 'atc_users_master'


// Random Art Crop Query
// 
// Returns: art_crop url for random card
router.post('/features/random/art', async function(req, res, next) {

  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  let id = alphabet[Math.floor(Math.random() * alphabet.length)]

  let validArt = false
  let artData = null;

  while(!validArt){

    let { data, error } = await supabase
    .from(atcMaster)
    .select('image_uris')
    .ilike('name', '%' + id + '%')
    .limit(1)

    if (error) {
      console.log(error)
      return
    }

    if(data[0].image_uris){
      validArt = true
      artData = data[0].image_uris.art_crop;
    }else{
      id = alphabet[Math.floor(Math.random() * alphabet.length)]
    }

  }

  res.json({randomArt : artData})

});


// Basic Card Search Query
// 
// Returns: id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects
router.post('/search/card/query=:queryCard', async function(req, res, next) {
  
  const results = []

  let queryCleanse = req.params.queryCard.split(" ").join("&")
  console.log(queryCleanse)

  let { data, error } = await supabase
  .from(atcMaster)
  .select('id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects')
  .ilike('name', '%' + req.params.queryCard + '%')

  results[0] = data

  if (error) {
    console.log(error)
    return
  }

  for (let i = 0; i < data.length; i++){
    if(data[i].card_faces !== null){
      await flipCards(data[i].id, data, i);
    }
  }

  res.json(results[0])

});


// Advanced Card Search Query
// 
// Returns: id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects
router.post('/search/card/adv/query?', async function(req, res, next) {

  const allQuery = {
    'artist': '*', 
    'cmc': '*', 
    'color_identity': '*',
    'colors': '*',
    'flavor_text': '*',
    'legalities': '*',
    'name': '*',
    'oracle_text': '*',
    'power': '*',
    'rarity': '*',
    'set_name': '*',
    'set_shorthand': '*',
    'subtype_': '*',
    'toughness': '*',
    'type_': '*'
  }

  for (var key in req.query){
    allQuery[key] = req.query[key]
  }
  
  const results = []

  const advancedParameters = {
    'artist': 'artist.ilike.*,artist.is.null',
    'cmc': 'cmc.ilike.*,cmc.is.null',
    'colors': 'colors.ilike.*,colors.is.null',
    'flavor_text': 'flavor_text.ilike.*,flavor_text.is.null',
    'oracle_text': 'oracle_text.ilike.*,oracle_text.is.null',
    'power': 'power.ilike.*,power.is.null',
    'subtype_': 'subtype_one.ilike.*,subtype_two.ilike.*,subtype_one.is.null,subtype_two.is.null',
    'toughness': 'toughness.ilike.*,toughness.is.null',
    'type_': 'type_one.ilike.*,type_two.ilike.*,type_one.is.null,type_two.is.null'
  }

  for (var key in allQuery){
    if(allQuery[key] !== null){
      if(key === 'subtype_'){
        advancedParameters[key] = `subtype_one.ilike.%${allQuery[key]}%, subtype_two.ilike.%${allQuery[key]}%`
      }else if(key === 'type_'){
        advancedParameters[key] = `type_one.ilike.%${allQuery[key]}%, type_two.ilike.%${allQuery[key]}%`
      }else{
        advancedParameters[key] = `${key}.ilike.%${allQuery[key]}%`
      }
    }
  }

  // "Best Case Scenario Search"
  let { data, error } = await supabase
  .from(atcMaster)
  .select('id, name, artist, border_color, card_faces, cmc, color_identity, colors, flavor_text, frame, frame_effects, image_uris, lang, layout, legalities, oracle_text, power, promo, rarity, set_name, set_shorthand, set_type, toughness, type_one, type_two, subtype_one, subtype_two')
  .or(advancedParameters['artist'])
  .or(advancedParameters['cmc'])
  .ilike('color_identity', '%' + allQuery.color_identity + '%')
  .or(advancedParameters['colors'])
  .or(advancedParameters['flavor_text'])
  //.ilike('legalities->>standard', allQuery.legalities) // TEST LINE
  .ilike('name', '%' + allQuery.name + '%')
  .or(advancedParameters['oracle_text'])
  .or(advancedParameters['power'])
  .ilike('rarity', allQuery.rarity)
  .ilike('set_name', '%' + allQuery.set_name + '%')
  .ilike('set_shorthand', allQuery.set_shorthand)
  .or(advancedParameters['subtype_'])
  .or(advancedParameters['toughness'])
  .or(advancedParameters['type_'])

  results[0] = data

  if (error) {
    console.log(error)
    return
  }

  for (let i = 0; i < data.length; i++){
    if(data[i].card_faces !== null){
      await flipCards(data[i].id, data, i);
    }
  }

  //console.log('RECORDS : ' + data.length)
  res.json(results[0])

});


// Helper Function for Flip Cards
async function flipCards(cardID, data, index){

  // Since card_faces was proving time and time again to fail, this will grab the entry via Scryfall's API.
  const fetch = require('node-fetch');
  let url='https://api.scryfall.com/cards/' + cardID
  let settings = { method: "Get" };

  await fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      data[index].card_faces = json.card_faces
  });

}


// Recent Deck Search Query
// 
// Returns: recent decks - deck_id, name, cover_art, user_id, user_name, created
router.post('/features/recent/decks', async function(req, res, next) {

  const username = []

  let { data, error } = await supabase
  .from(deckMaster)
  .select()
  .order('created', {ascending: false})
  .limit(6)

  if (error) {
    console.log(error)
    return
  }

  for (let i = 0; i < data.length; i++){
    await getUsername(data[i].user_id, username)
    data[i].user_name = username[0]
  }

  res.json(data)

});


// Basic Deck Search Query
// 
// Returns: deck_id, name, cover_art, user_id, user_name, created
router.post('/search/deck/query=:queryDeck', async function(req, res, next) {

  const username = []

  let { data, error } = await supabase
  .from(deckMaster)
  .select()
  .ilike('name', '%' + req.params.queryDeck + '%')

  if (error) {
    console.log(error)
    return
  }

  for (let i = 0; i < data.length; i++){
    await getUsername(data[i].user_id, username)
    data[i].user_name = username[0]
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
  const username = []

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

  await getUsername(data[0].user_id, username)

  res.json({deck_id: data[0].deck_id, name: data[0].name, cover_art: data[0].cover_art, user_name: username[0], user_id: data[0].user_id, cards: results})

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
  })

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


// Helper Function For Getting A ReQuery
async function getUsername(id, username){

  let { data, error } = await supabase
  .from(usersMaster)
  .select('username')
  .eq('id', id)

  if (error) {
    console.log(error)
    return
  }

  username[0] = data[0].username

}


// Must ALWAYS Be At The Bottom
module.exports = router;