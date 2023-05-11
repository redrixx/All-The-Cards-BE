// Imports
const cardRequests = require('../requests/card.js')
const atc = require('../references/atc.json')

// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.API_KEY
)

// Helper Function For Getting Deck Cards - Advanced Method
async function getCardsAdvanced(deckID){

    var cardIDs = []
    var results = []
    
    let { data, error } = await supabase
    .from(atc.decksMaster)
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

                var thisData = await getCard(cardIDs[index].card_id)
        
                if (!error) {
                    results.push(thisData)
                    previousID = cardIDs[index].card_id
                }

            }
    
        }

        return results

    }

    return {Error: "An unexpected error occurred during deck retrieval."}

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
    }

    return cardData[0]

}

// Helper function for getting a username
async function getUsername(id) {

    let { data, error } = await supabase
        .from(atc.usersMaster)
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
        .from(atc.usersMaster)
        .select('id, username')
        .ilike('favorites->>decks', `%${deckID}%` )

    if (!error) {
        results = data.length
    }

    return results

}

// Helper Function For Getting Cover Card
async function getCoverCard(cardURL, data) {

    var coverCard

    if(cardURL && cardURL.startsWith("https://pkzscplmxataclyrehsr.supabase.co")){

        let { data, error } = await supabase.from(atc.atcCustom).select().eq('image_uris->>art_crop', cardURL)

        if(!error){
            coverCard = data[0]
        }

    }else{

        coverCard = await getCard(data[0].cover_art.slice(data[0].cover_art.lastIndexOf('/') + 1, data[0].cover_art.lastIndexOf('.')))

    }

    return coverCard

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

// Helper Function For Validating Against Prohibited Table
async function isProhibited(value) {

    if(typeof value === 'string'){
        value = value.split(/[/\s,.-]+/)
        value = value.filter(n => n)
    }else{
        newvalue = []
        for(var subvalue in value){
            value[subvalue] = value[subvalue].split(/[/\s,.-]+/)
            value[subvalue] = value[subvalue].filter(n => n)
            for(var subsubvalue in value[subvalue]){
                newvalue.push(value[subvalue][subsubvalue])
            }
        }
        value = newvalue
    }

    //console.log(value)

    for(var keyword in value){
        let { data, error } = await supabase.from(atc.atcProhibited).select().contains('dictionary', [value[keyword].toLowerCase()])
        if(data && data.length > 0){ console.log(`PROHIBITED WORD DETECTED: ${value[keyword]}`) }
        if(data && data.length > 0){ return true }
    }

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
            .from(atc.deckMaster)
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
            cover_card: (await getCoverCard(data[0].cover_art, data)),
            commander: (await getCard(data[0].commander)),
            isValid: data[0].isValid, 
            user_name: username, 
            user_id: data[0].user_id, 
            favorites: favorites,
            cards: results 
        })

    },

    // Favorite Count From DeckID
    // 
    // Returns: favorited count for specified deckID
    deckFavoriteCount: async function (deckID) {

        var results

        let { data, error } = await supabase
            .from(atc.usersMaster)
            .select('id, username')
            .ilike('favorites->>decks', `%${deckID}%` )

        if (!error) {
            results = data.length
        }

        return results

    },

    // Deck by UserID Query
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    decksByUser: async function (req) {

        let { data, error } = await supabase
            .from(atc.deckMaster)
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
            .from(atc.deckMaster)
            .select()
            .ilike('name', '%' + req.params.queryDeck + '%')

        if (error) {
            console.log(error)
            return
        }

        for (var entry in data){
            data[entry].containsCustom = await checkContainsCustom(data[entry].id)
            data[entry].user_name = await getUsername(data[entry].user_id)
        }

        return data

    },

    // Basic Deck Search Query By ID
    // 
    // Returns: deck_id, name, cover_art, user_id, user_name, created
    deckSearchByID: async function (deckID) {

        let { data, error } = await supabase
            .from(atc.deckMaster)
            .select()
            .eq('id', deckID)

        if (error) {
            console.log(error)
            return
        }

        data[0].user_name = await getUsername(data[0].user_id)

        return data[0]

    },

    // Deck Editor Upload
    // 
    // Returns: Message or Error
    createDeck: async function (req) {

        const payload = req.body

        var response = {}
        var deckURL

        // Field Validation Checks
        if(!payload.title){ return {Error: "No deck title provided."} }
        if(!payload.coverCard){ return {Error: "No cover card provided."} }
        if(!payload.formatTag){ return {Error: "No format provided."} }

        var tempTitle = Object.assign({}, payload.title)
        var tempDesc = Object.assign({}, payload.description)
        var tempTags = Object.assign({}, payload.tags)

        // Prohibited Validation Check
        if(await isProhibited(tempTitle)) { return { Error: "There is a prohibited word in the deck title." } }
        if(await isProhibited(tempDesc)) { return { Error: "There is a prohibited word in the deck description." } }
        if(await isProhibited(tempTags)) { return { Error: "There is a prohibited word in the deck tags." } }

        if(payload.deckID === null | payload.deckID === ""){

            // New Deck Creation
            date = new Date()
            date = new Date(date.getTime() - date.getTimezoneOffset()*60000)

            if(!payload.authorID){ payload.authorID = 'anonymous' }

            const { data, error } = await supabase
                .from(atc.deckMaster)
                .insert({
                    name: payload.title, 
                    user_id: payload.authorID, 
                    cover_art: (await getCard(payload.coverCard)).image_uris.art_crop, 
                    created: date.toISOString(),
                    format: payload.formatTag, 
                    description: payload.description, 
                    tags: payload.tags,
                    commander: payload.commander,
                    isValid: payload.isValid
            }).select()

            if(!error){

                deckURL = data[0].id

                for(var card in payload.cards){
                    const { error } = await supabase
                        .from(atc.decksMaster)
                        .insert({
                            card_id: payload.cards[card],
                            user_id: payload.authorID,
                            deck_id: data[0].id
                    })

                    if(error){
                        response = {Error: "An error occured during deck creation insertion."}
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
                .from(atc.deckMaster)
                .update({
                    name: payload.title, 
                    user_id: payload.authorID, 
                    cover_art: (await getCard(payload.coverCard)).image_uris.art_crop, 
                    format: payload.formatTag, 
                    description: payload.description, 
                    tags: payload.tags,
                    commander: payload.commander,
                    isValid: payload.isValid
            }).eq('id', payload.deckID)

            const{ error } = await supabase
            .from(atc.decksMaster)
            .delete()
            .eq('deck_id', payload.deckID)
            .then()

            if(!error){

                deckURL = payload.deckID

                for(var card in payload.cards){
                    const { error } = await supabase
                        .from(atc.decksMaster)
                        .insert({
                            card_id: payload.cards[card],
                            user_id: payload.authorID,
                            deck_id: payload.deckID
                    })

                    if(error){
                        response = {Error: "An error occured during deck overwrite insertion."}
                        return response
                    }

                }

            }else{
                response = {Error: "An unexpected error occured during deck overwrite."}
                return response
            }

        }

        response = {Message: "Deck created successfully.", "URL" : `/api/get/deck/id=${deckURL}`}
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
                    .from(atc.deckMaster)
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
                        .from(atc.decksMaster)
                        .delete()
                        .eq('deck_id', req.headers.deckid)

                    // Deletion at the Deck Header Level
                    const{} = await supabase
                        .from(atc.deckMaster)
                        .delete()
                        .eq('id', req.headers.deckid)

                    // Deletion at the Deck Favorites Level
                    const{data, error} = await supabase
                        .from(atc.usersMaster)
                        .select('id, favorites')
                        .ilike('favorites->>decks', `%${req.headers.deckid}%`)

                    for(var entry in data){

                        data[entry].favorites.decks = data[entry].favorites.decks.filter(e => e !== req.headers.deckid)
                        const { error } = await supabase
                        .from(atc.usersMaster)
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