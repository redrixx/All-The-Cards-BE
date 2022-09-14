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

    // Random Art Crop Query
    // 
    // Returns: art_crop url for random card
    getRandomArt: async function (req) {

        const alphabet = "abcdefghijklmnopqrstuvwxyz"
        let id = alphabet[Math.floor(Math.random() * alphabet.length)]

        let validArt = false
        let artData = null;

        while (!validArt) {

            let { data, error } = await supabase
                .from(atcMaster)
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
    getRecentDecks: async function (req) {

        const username = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .order('created', { ascending: false })
            .limit(6)

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