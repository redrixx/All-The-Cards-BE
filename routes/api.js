// Imports
const adminRequests = require('../requests/administrative.js')
const cardRequests = require('../requests/card.js')
const deckRequests = require('../requests/deck.js')
const featureRequests = require('../requests/features.js')
const userRequests = require('../requests/user.js')


// Initial Setup
var uuid = require('uuid')
var tempUUID = uuid.v4()
var express = require('express');
var multer = require('multer');
var router = express.Router();
const storage = multer.diskStorage({
  destination (req, file, cb) {
      cb(null, 'storage/cards')
  },
  filename (req, file, cb) {
      cb(null, tempUUID + '-' + file.originalname)
  }
})
const upload = multer({storage})


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


// Top Three Deck Search Query
router.post('/features/topthree/decks', async function (req, res, next) {

  res.json(await featureRequests.getTopDecks(req))

});


// Deck Editor Upload/Edit
router.post('/features/editor/decks', async function (req, res, next) {

  res.json(await deckRequests.createDeck(req))

});


// Deck Editor Delete
router.delete('/features/editor/delete', async function (req, res, next) {

  res.json(await deckRequests.deleteDeck(req))

});


// Card Editor Upload/Edit
router.post('/features/editor/cards', upload.fields([{name: 'art_crop'}, {name: 'png'}]), async function (req, res, next) {

  tempUUID = uuid.v4()
  res.json(await cardRequests.createCard(req))

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


// User Account Delete
router.delete('/features/user/delete', async function (req, res, next) {

  res.json(await userRequests.deleteUser(req))

});


// User Card/Deck Favorite Update
router.post('/features/user/favorite', async function (req, res, next) {

  res.json(await userRequests.updateFavorites(req))

});


// Administrative Calls
router.post('/administrative', async function (req, res, next) {

  res.json(await adminRequests.handleAdmin(req))

});


// Must ALWAYS Be At The Bottom
module.exports = router;