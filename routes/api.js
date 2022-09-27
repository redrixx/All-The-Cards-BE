// Imports
const cardRequests = require('../requests/card.js')
const deckRequests = require('../requests/deck.js')
const featureRequests = require('../requests/features.js')
const userRequests = require('../requests/user.js')


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


// Deck Editor Upload
router.post('/features/editor/decks', async function (req, res, next) {

  res.json(await deckRequests.createDeck(req))

});

// Deck Editor Retrieve
router.post('/features/editor/retrieve', async function (req, res, next) {

  res.json(await deckRequests.editDeck(req))

});


// Basic Deck Search Query
router.post('/search/deck/query=:queryDeck', async function (req, res, next) {

  res.json(await deckRequests.deckSearch(req))

});


// Basic User Search Query
router.post('/search/user/query=:queryUser', async function (req, res, next) {

  res.json(await userRequests.userSearch(req))

});


// Card ID Query
router.post('/get/card/id=:cardID', async function (req, res, next) {

  res.json(await cardRequests.getCardID(req))

});


// Deck ID Query
router.post('/get/deck/id=:deckID', async function (req, res, next) {

  res.json(await deckRequests.getDeckID(req))

});


// Decks by User Query
router.post('/get/decks/user_id=:userID', async function (req, res, next) {

  res.json(await deckRequests.decksByUser(req))

});


// User ID Query
router.post('/get/user/id=:userID', async function (req, res, next) {

  res.json(await userRequests.getUserID(req))

});


// User Settings Update Query
router.post('/features/user/update', async function (req, res, next) {

  res.json(await userRequests.updateUser(req))

});


// Must ALWAYS Be At The Bottom
module.exports = router;