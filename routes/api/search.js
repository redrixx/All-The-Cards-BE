// Imports
const cardRequests = require('../../requests/card.js')
const deckRequests = require('../../requests/deck.js')
const userRequests = require('../../requests/user.js')

var router = require('express').Router();


// Basic Card Search Query
router.post('/card/query=:queryCard', async function (req, res, next) {

    res.json(await cardRequests.cardSearch(req))
  
});
  
  
// Advanced Card Search Query
router.post('/card/adv/query=?', async function (req, res, next) {

    res.json(await cardRequests.cardSearchAdvanced(req))

});


// Basic Deck Search Query
router.post('/deck/query=:queryDeck', async function (req, res, next) {

    res.json(await deckRequests.deckSearch(req))

});


// Basic User Search Query
router.post('/user/query=:queryUser', async function (req, res, next) {

    res.json(await userRequests.userSearch(req))

});


// Must always be at the end.
module.exports = router;