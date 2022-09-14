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
async function getCards(cardID, results) {

    let { data, error } = await supabase
        .from(atcMaster)
        .select()
        .eq('id', cardID)

    if (error) {
        console.log(error)
        return
    }

    results.push(data[0])

}


// Helper function for getting a username
async function getUsername(id, username) {

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

module.exports = {

    // Deck ID Query
    // 
    // Returns: Array of Entire Card Objects
    getDeckID: async function (req) {

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

        for (let i = 0; i < data.length; i++) {
            await getCards(data[i].card_id, results);
        }

        await getUsername(data[0].user_id, username)

        return ({ deck_id: data[0].deck_id, name: data[0].name, cover_art: data[0].cover_art, user_name: username[0], user_id: data[0].user_id, cards: results })

    },

    // Basic Deck Search Query
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    deckSearch: async function (req) {

        const username = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .ilike('name', '%' + req.params.queryDeck + '%')

        if (error) {
            console.log(error)
            return
        }

        for (let i = 0; i < data.length; i++) {
            await getUsername(data[i].user_id, username)
            data[i].user_name = username[0]
        }

        return data

    }

}