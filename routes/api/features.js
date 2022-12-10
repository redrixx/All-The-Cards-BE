// Imports
const cardRequests = require('../../requests/card.js')
const deckRequests = require('../../requests/deck.js')
const featureRequests = require('../../requests/features.js')
const userRequests = require('../../requests/user.js')

var router = require('express').Router();

// Initial Setup
var uuid = require('uuid')
var tempUUID = uuid.v4()
var multer = require('multer');
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
router.post('/random/art', async function (req, res, next) {

    res.json(await featureRequests.getRandomArt(req))
  
});

// Recent Deck Search Query
router.post('/recent/decks', async function (req, res, next) {

    res.json(await featureRequests.getRecentDecks(req))
  
});
  
  
// Top Three Deck Search Query
router.post('/topthree/decks', async function (req, res, next) {

    res.json(await featureRequests.getTopDecks(req))

});
  
  
// Deck Editor Upload/Edit
router.post('/editor/decks', async function (req, res, next) {

    res.json(await deckRequests.createDeck(req))

});
  
  
// Deck Editor Delete
router.delete('/editor/delete', async function (req, res, next) {

    res.json(await deckRequests.deleteDeck(req))

});
  
  
// Card Editor Upload/Edit
router.post('/editor/cards', upload.fields([{name: 'art_crop'}, {name: 'png'}]), async function (req, res, next) {

    tempUUID = uuid.v4()
    res.json(await cardRequests.createCard(req))

});
  
  
// Card Editor Delete
router.delete('/editor/card-delete', async function (req, res, next) {

    res.json(await cardRequests.deleteCard(req))

});

// User Settings Update Query
router.post('/user/update', async function (req, res, next) {

    res.json(await userRequests.updateUser(req))
  
});
  
  
// User Account Delete
router.delete('/user/delete', async function (req, res, next) {

    res.json(await userRequests.deleteUser(req))

});
  
  
// User Card/Deck Favorite Update
router.post('/user/favorite', async function (req, res, next) {

    res.json(await userRequests.updateFavorites(req))

});

// Must always be at the end.
module.exports = router;