// Imports
const cardRequests = require('../requests/card.js')
const deckRequests = require('../requests/deck.js')
const atc = require('../references/atc.json')

// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.API_KEY
)

// Helper function for getting a username
async function getUsername(id) {

    if(!id | id === 'anonymous'){ 

        return ('anonymous')

    }else{

    let { data, error } = await supabase
        .from(atc.usersMaster)
        .select('username')
        .eq('id', id)

    if (error) {
        console.log(error)
        return
    }

    return (data[0].username)

    }

}

// Helper Function For Getting Deck Cards
async function getCard(cardID) {

    var cardData, cardError

    if(cardID && cardID.startsWith("custom-")){

        let { data, error } = await supabase
        .from(atc.atcCustom)
        .select()
        .eq('id', cardID)

        cardData = data
        cardError = error

    }else{

        let { data, error } = await supabase
        .from(atc.atcMaster)
        .select()
        .eq('id', cardID)

        cardData = data
        cardError = error

    }

    if (cardError) {
        console.log(cardError)
        return
    }

    return cardData[0]

}

// Helper Function For Getting Cards By Searching
async function cardSearch(cardName) {

    let { data, error } = await supabase
        .from(atc.atcMaster)
        .select('id, name')
        .eq('name', cardName)


    if (error) {
        console.log(error)
        return
    }

    return data

}

// Helper Function For Checking If Custom Cards Are In A Deck
async function checkContainsCustom(deckID) {

    let { data, error } = await supabase
        .from(atc.decksMaster)
        .select()
        .eq('deck_id', deckID)
        .ilike('card_id', "custom-%")


    if (error) {
        console.log(error)
        return
    }

    if(data.length > 0){
        return true
    }

    return false

}


module.exports = {

    // Random Art Crop Query
    // 
    // Returns: art_crop url for random card
    getRandomArt: async function (req) {

        const alphabet = "abcdefghijklmnopqrstuvwxyz"
        let id = alphabet[Math.floor(Math.random() * alphabet.length)]

        let validArt = false
        let artData = null

        while (!validArt) {

            let { data, error } = await supabase
                .from(atc.atcMaster)
                .select('image_uris')
                .ilike('name', '%' + id + '%')
                .limit(100)

            if (error) {
                console.log(error)
                return
            }

            if (data[0].image_uris) {
                validArt = true
                artData = data[0].image_uris.art_crop;
            } else {
                id = alphabet[Math.floor(Math.random() * alphabet.length)]
            }

        }

        return ({ randomArt: artData })

    },

    // Recent Deck Search Query
    // 
    // Returns: recent decks - deck_id, name, cover_art, user_id, user_name, created
    // Update: 11/17/22 - Now filters out decks with custom cards. Also returns 20 most recent vs 6 most recent.
    getRecentDecks: async function (req) {

        let { data, error } = await supabase
            .from(atc.deckMaster)
            .select()
            .order('created', { ascending: false })
            .limit()

        if (error) {
            console.log(error)
            return
        }

        for(var deck in data){
            if(await checkContainsCustom(data[deck].id)){
                data.splice(deck, 1)
            }
        }

        data = data.slice(0,20)

        for (var deck in data) {
            data[deck].user_name = await getUsername(data[deck].user_id)
        }

        return data

    },

    // Top Three Deck Search Query
    // 
    // Returns: top three decks - deck_id, name, cover_art, user_id, user_name, created
    getTopDecks: async function (req) {

        if(!req.headers.cardid){

            return {Error: "No cardID provided."}

        }else{

            cardData = await getCard(req.headers.cardid)
            if(cardData) { if(cardData.length === 0) { response = {Error: "An unexpected error occured during top deck retrieval."}; return response } }

            if(!cardData){

                response = {Error: "An unexpected error occured during top deck retrieval."}
                return response

            }else{
                
                var nameResults = []
                // Retrieve all variants of the same card by name
                if(cardData.id.startsWith("custom-")){
                    nameResults[0] = cardData
                }else{
                    nameResults = await cardSearch(cardData.name)
                }
                
                // Concat query string with all variants
                var deckResults = []
                var searchQuery = ""
                for(var card in nameResults){
                    searchQuery += `card_id.eq.${nameResults[card].id},`
                }
                searchQuery = searchQuery.substring(0, searchQuery.length - 1)

                // The query string is searched against the deck-cards table,
                // then unique-ified by deckIDs.
                let { data } = await supabase
                .from(atc.decksMaster)
                .select('deck_id')
                .or(searchQuery)
                deckResults = [... new Set(data.map(JSON.stringify))].map(JSON.parse)

                // The favorite counts for all the decks are retrieved,
                // then the results are sorted in order descending.
                var allResults = []
                for(var deck in deckResults){
                    allResults.push({deckID : deckResults[deck].deck_id})
                    allResults[deck].favCount = await deckRequests.deckFavoriteCount(deckResults[deck].deck_id)
                }
                allResults.sort(function(a, b) {return b.favCount - a.favCount})

                // Only the top three are needed, allResults is already in order.
                // If the results are greater than 3, then only the first (top) three decks are gotten.
                // If the results are fewer than 3, then all decks are gotten.
                var topResults = []
                if(allResults.length > 3){
                    for(var entry = 0; entry < 3; entry++){
                        topResults.push(await deckRequests.deckSearchByID(allResults[entry].deckID))
                        topResults[entry].favorites = allResults[entry].favCount
                    }
                }else{
                    for(var entry in allResults){
                        topResults.push(await deckRequests.deckSearchByID(allResults[entry].deckID))
                        topResults[entry].favorites = allResults[entry].favCount
                    }
                }

                return topResults

            }
        }

    },

}