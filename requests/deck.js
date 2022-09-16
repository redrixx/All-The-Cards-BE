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

// Helper Function For Getting Deck Cards
async function getDeckCards(deckID) {

    results = []

    let { data, error } = await supabase
        .from(decksMaster)
        .select()
        .eq('deck_id', deckID)

    if (!error) {
        for(var card in data){
            results.push(await getCard(data[card].card_id))
        }
    }

    return results

}

// Helper Function For Getting Deck Cards
async function getCard(cardID) {

    let { data, error } = await supabase
        .from(atcMaster)
        .select()
        .eq('id', cardID)

    if (error) {
        console.log(error)
        return
    }

    return data[0]

}

// Helper function for getting a username
async function getUsername(id) {

    let { data, error } = await supabase
        .from(usersMaster)
        .select('username')
        .eq('id', id)

    if (error) {
        console.log(error)
        return
    }

    return data[0].username

}

module.exports = {

    // Deck ID Query
    // 
    // Returns: Array of Entire Card Objects
    getDeckID: async function (req) {

        var results = []
        var username = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .eq('id', req.params.deckID)

        if (error) {
            console.log(error)
            return
        }

        results = await getDeckCards(req.params.deckID)
        username = await getUsername(data[0].user_id)

        return ({ deck_id: data[0].id, created: data[0].created, name: data[0].name, format: data[0].format, cover_art: data[0].cover_art, user_name: username, user_id: data[0].user_id, cards: results })

    },

    // Deck by UserID Query
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    decksByUser: async function (req) {

        const username = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .eq('user_id', req.params.userID)

        if (!error) {
            for (var entry in data){
                data[entry].user_name = await getUsername(data[entry].user_id)
            }
        }

        return data

    },

    // Basic Deck Search Query
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    deckSearch: async function (req) {

        var username = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .ilike('name', '%' + req.params.queryDeck + '%')

        if (error) {
            console.log(error)
            return
        }

        for (var entry in data){
            data[entry].user_name = await getUsername(data[entry].user_id)
        }

        return data

    },

    // Deck Editor Upload
    // 
    // Returns: Array of Entire Card Objects
    createDeck: async function (req) {

        return (req.body)

    },

}