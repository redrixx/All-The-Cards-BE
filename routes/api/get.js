// Imports
const cardRequests = require('../../requests/card.js')
const deckRequests = require('../../requests/deck.js')
const userRequests = require('../../requests/user.js')

var router = require('express').Router();

// Card ID Query
router.post('/card/id=:cardID', async function (req, res, next) {

    res.json(await cardRequests.getCardID(req))
  
});
  
  
// Deck ID Query
router.post('/deck/id=:deckID', async function (req, res, next) {

    res.json(await deckRequests.getDeckID(req))

});


// Decks by User Query
router.post('/decks/user_id=:userID', async function (req, res, next) {

    res.json(await deckRequests.decksByUser(req))

});


// Cards by User Query
router.post('/cards/user_id=:userID', async function (req, res, next) {

    res.json(await cardRequests.cardsByUser(req))

});
  
  
// User ID Query
router.post('/user/id=:userID', async function (req, res, next) {

    res.json(await userRequests.getUserID(req))

});

// Must always be at the end.
module.exports = router;