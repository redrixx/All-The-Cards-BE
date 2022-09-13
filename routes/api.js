// Imports
const cardRequests = require('../requests/card.js')
const deckRequests = require('../requests/deck.js')
const featureRequests = require('../requests/features.js')


// Initial Setup
var express = require('express');
var router = express.Router();


// Random Art Crop Query
router.post('/features/random/art', async function (req, res, next) {

  res.json(await featureRequests.getRandomArt(req))

});


// Basic Card Search Query
router.post('/search/card/query=:queryCard', async function (req, res, next) {

  res.json(await cardRequests.cardSearch(req))

});


// Advanced Card Search Query
router.post('/search/card/adv/query=?', async function (req, res, next) {

  res.json(await cardRequests.cardSearchAdvanced(req))

});


// Recent Deck Search Query
router.post('/features/recent/decks', async function (req, res, next) {

  res.json(await featureRequests.getRecentDecks(req))

});


// Basic Deck Search Query
router.post('/search/deck/query=:queryDeck', async function (req, res, next) {

  res.json(await deckRequests.deckSearch(req))

});


// Card ID Query
router.post('/get/card/id=:cardID', async function (req, res, next) {

  res.json(await cardRequests.getCardID(req))

});


// Deck ID Query
router.post('/get/deck/id=:deckID', async function (req, res, next) {

  res.json(await deckRequests.getDeckID(req))

});


// Must ALWAYS Be At The Bottom
module.exports = router;