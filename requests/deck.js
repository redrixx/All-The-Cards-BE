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

        return ({ deck_id: data[0].id, created: data[0].created, name: data[0].name, description: data[0].description, tags: data[0].tags, format: data[0].format, cover_art: data[0].cover_art, user_name: username, user_id: data[0].user_id, cards: results })

    },

    // Deck by UserID Query
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    decksByUser: async function (req) {

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
    // Returns: Message or Error
    createDeck: async function (req) {

        const payload = req.body

        var response = {}

        // console.log(payload.deckID)
        // console.log(payload.authorID)
        // console.log(payload.coverCard)
        // console.log(payload.description)
        // console.log(payload.formatTag)
        // console.log(payload.title)
        // console.log(payload.tags)
        // console.log(payload.cards)

        if(payload.deckID === null | payload.deckID === ""){

            // New Deck Creation
            date = new Date()
            date = new Date(date.getTime() - date.getTimezoneOffset()*60000);

            const { data, error } = await supabase
                .from(deckMaster)
                .insert({
                    name: payload.title, 
                    user_id: payload.authorID, 
                    cover_art: (await getCard(payload.coverCard)).image_uris.art_crop, 
                    created: date.toISOString(),
                    format: payload.formatTag, 
                    description: payload.description, 
                    tags: payload.tags
            }).select()

            if(!error){

                for(var card in payload.cards){
                    const { error } = await supabase
                        .from(decksMaster)
                        .insert({
                            card_id: payload.cards[card],
                            user_id: payload.authorID,
                            deck_id: data[0].id
                    })

                    if(error){
                        response = {Error: "An unexpected error occured during deck creation."}
                        return response
                    }

                }

            }else{
                response = {Error: "An unexpected error occured during deck creation."}
                return response
            }

        }else{

            // Existing Deck Edit
            const { data } = await supabase
                .from(deckMaster)
                .update({
                    name: payload.title, 
                    user_id: payload.authorID, 
                    cover_art: (await getCard(payload.coverCard)).image_uris.art_crop, 
                    format: payload.formatTag, 
                    description: payload.description, 
                    tags: payload.tags
            }).eq('id', payload.deckID)

            const{ error } = await supabase
                .from(decksMaster)
                .delete()
                .eq('deck_id', payload.deckID)

            if(!error){

                for(var card in payload.cards){
                    const { error } = await supabase
                        .from(decksMaster)
                        .insert({
                            card_id: payload.cards[card],
                            user_id: payload.authorID,
                            deck_id: payload.deckID
                    })

                    if(error){
                        response = {Error: "An unexpected error occured during deck creation."}
                        return response
                    }

                }

            }else{
                response = {Error: "An unexpected error occured during deck creation."}
                return response
            }

        }

        response = {Message: "Deck created successfully."}
        return response

    },

    // Deck Editor Retrieve wipDeck
    // 
    // Returns: Formatted wipDeck
    editDeck: async function (req) {

        const payload = req.body

        var response = {
            deckID: null,
            authorID: null,
            coverCard: null,
            description: null,
            formatTag: null,
            title: null,
            tags: null,
            cards: []
        }

        if(payload.deckID === null | payload.deckID === ""){

            response = {Error: "An unexpected error occured during deck retrieval."}
            return response

        }else{

            // Existing Deck Retrieval
            const { data, error } = await supabase
                .from(deckMaster)
                .select()
                .eq('id', payload.deckID)

            const deckData = data

            if(error | !deckData){

                response = {Error: "An unexpected error occured during deck creation."}
                return response

            }else{

                response.deckID = deckData[0].id
                response.authorID = deckData[0].user_id
                response.coverCard = deckData[0].cover_art.slice(deckData[0].cover_art.lastIndexOf('/') + 1, deckData[0].cover_art.lastIndexOf('.'))
                response.description = deckData[0].description
                response.formatTag = deckData[0].format
                response.title = deckData[0].name
                response.tags = deckData[0].tags

                const{ data } = await supabase
                    .from(decksMaster)
                    .select()
                    .eq('deck_id', response.deckID)
                    .select('card_id')

                for(var card in data){
                    response.cards.push(data[card].card_id)
                }

            }

        }

        return response

    },

}