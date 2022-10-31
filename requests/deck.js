// Imports
const cardRequests = require('../requests/card.js')

// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.API_KEY
)

// Database References
const limitedData = 'id, name, artist, border_color, card_faces, cmc, color_identity, colors, digital, finishes, flavor_text, frame, frame_effects, full_art, games, image_uris, lang, layout, legalities, mana_cost, oracle_text, power, prices, produced_mana, promo, rarity, released_at, set_name, set_shorthand, set_type, toughness, type_one, type_two, subtype_one, subtype_two'
const atcMaster = 'atc_cards_master'
const decksMaster = 'atc_decks_master'
const deckMaster = 'atc_deck_master'
const usersMaster = 'atc_users_master'

// Helper Function For Getting Deck Cards - Advanced Method
async function getCardsAdvanced(deckID){

    var cardIDs = []
    var results = []
    
    let { data, error } = await supabase
    .from(decksMaster)
    .select('card_id')
    .eq('deck_id', deckID)
    .order('card_id')

    cardIDs = data

    if(!error){

        var previousID = ""
    
        for (var index=0, max=cardIDs.length; index < max; ++index){
    
            if(cardIDs[index].card_id === previousID){

                results.push(results[results.length - 1])

            }else{

                let { data, error } = await supabase
                .from(atcMaster)
                .select(limitedData)
                .eq('id', cardIDs[index].card_id)
        
                if (!error) {
                    results.push(data[0])
                    previousID = cardIDs[index].card_id
                }

            }
    
        }

        return results

    }

    return {Error: "An unexpected error occurred during deck retrieval."}

}

// Helper Function For Getting Deck Cards
async function getDeckCards(deckID) {

    results = []

    let { data, error } = await supabase
        .from(decksMaster)
        .select()
        .eq('deck_id', deckID)

    if (!error) {
        for (var card=0, max=data.length; card < max; ++card){
            results.push(await getCard(data[card].card_id))
        }
    }

    return results

}

// Helper Function For Getting Deck Cards
async function getCard(cardID) {

    let { data, error } = await supabase
        .from(atcMaster)
        .select(limitedData)
        .eq('id', cardID)

    console.log(data)

    if (!error) {
        return data[0]
    }

    console.log(error)
    return error

}

// Helper function for getting a username
async function getUsername(id) {

    let { data, error } = await supabase
        .from(usersMaster)
        .select('username')
        .eq('id', id)

    if (error) {
        if(!data){
            data = [{username: 'anonymous'}] 
        }else{
            console.log(error)
            return
        }
    }

    return data[0].username

}

// Helper Function For Getting Deck Cards
async function getFavoriteCount(deckID) {

    var results

    let { data, error } = await supabase
        .from(usersMaster)
        .select('id, username')
        .ilike('favorites->>decks', `%${deckID}%` )

    if (!error) {
        results = data.length
    }

    return results

}

module.exports = {

    // Deck ID Query
    // 
    // Returns: Array of Entire Card Objects
    getDeckID: async function (req) {

        var results = []
        var username = []
        var favorites = []

        let { data, error } = await supabase
            .from(deckMaster)
            .select()
            .eq('id', req.params.deckID)

        if (error) {
            console.log(error)
            return
        }

        results = await getCardsAdvanced(req.params.deckID)
        username = await getUsername(data[0].user_id)
        favorites = await getFavoriteCount(data[0].id)


        return ({ 
            deck_id: data[0].id, 
            created: data[0].created, 
            name: data[0].name, 
            description: data[0].description, 
            tags: data[0].tags, 
            format: data[0].format, 
            cover_art: data[0].cover_art, 
            user_name: username, 
            user_id: data[0].user_id, 
            favorites: favorites,
            cards: results 
        })

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
        var deckURL

        if(payload.deckID === null | payload.deckID === ""){

            // New Deck Creation
            date = new Date()
            date = new Date(date.getTime() - date.getTimezoneOffset()*60000);

            if(!payload.authorID){ payload.authorID = 'anonymous' }

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

                deckURL = data[0].id

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
            .then()

            if(!error){

                deckURL = payload.deckID

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

        response = {Message: "Deck created successfully.", "URL" : `/api/get/deck/id=${deckURL}`}
        return response

    },

    // Deck Editor Retrieve wipDeck
    // 
    // Returns: Formatted wipDeck
    editDeck: async function (req) {

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

        if(!req.headers.token){

            response = {Error: "No token provided."}
            return response
            
        }else{

            const { data, error } = await supabase.auth.getUser(req.headers.token)
            if(error){ response = {Error: "Invalid token provided."}; return response }
            userData = data

            if(!req.headers.deckid){

                response = {Error: "Invalid deckID provided."}
                return response
    
            }else{
    
                // Existing Deck Retrieval
                const { data, error } = await supabase
                    .from(deckMaster)
                    .select()
                    .eq('id', req.headers.deckid)
                    .eq('user_id', userData.user.id)

                const deckData = data
    
                if(error | !deckData | deckData.length === 0){
    
                    response = {Error: "An unexpected error occured during deck retrieval."}
                    return response
    
                }else{
    
                    response.deckID = deckData[0].id
                    response.authorID = deckData[0].user_id
                    response.coverCard = await cardRequests.getLimitedCard(deckData[0].cover_art.slice(deckData[0].cover_art.lastIndexOf('/') + 1, deckData[0].cover_art.lastIndexOf('.')))
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
                        response.cards.push(await cardRequests.getLimitedCard(data[card].card_id))
                    }
    
                }
    
            }

        }

        return response

    },

    // Deck Editor Delete
    // 
    // Returns: Message or Error
    deleteDeck: async function (req) {

        var response = {}

        if(!req.headers.token){

            response = {Error: "No token provided."}
            return response
            
        }else{

            const { data, error } = await supabase.auth.getUser(req.headers.token)
            if(error){ response = {Error: "Invalid token provided."}; return response }
            userData = data

            if(!req.headers.deckid){

                response = {Error: "Invalid deckID provided."}
                return response
    
            }else{
    
                // Existing Deck Check
                const { data, error } = await supabase
                    .from(deckMaster)
                    .select()
                    .eq('id', req.headers.deckid)
                    .eq('user_id', userData.user.id)

                const deckData = data

                if(deckData) { if(deckData.length === 0) { response = {Error: "An unexpected error occured during deck removal."}; return response } }
    
                if(!data | error | !deckData){
    
                    response = {Error: "An unexpected error occured during deck removal."}
                    return response
    
                }else{  // Proceed with Deletion
    
                    // Deletion at the Deck Cards Level
                    const{} = await supabase
                        .from(decksMaster)
                        .delete()
                        .eq('deck_id', req.headers.deckid)

                    // Deletion at the Deck Header Level
                    const{} = await supabase
                        .from(deckMaster)
                        .delete()
                        .eq('id', req.headers.deckid)

                    // Deletion at the Deck Favorites Level
                    const{data, error} = await supabase
                        .from(usersMaster)
                        .select('id, favorites')
                        .ilike('favorites->>decks', `%${req.headers.deckid}%`)

                    for(var entry in data){

                        data[entry].favorites.decks = data[entry].favorites.decks.filter(e => e !== req.headers.deckid)
                        const { error } = await supabase
                        .from(usersMaster)
                        .update({ 'favorites' : data[entry].favorites })
                        .eq('id', data[entry].id)

                    }
    
                }
    
            }

        }

        response = {Message: "Deck deletion successful."}
        return response

    },

}