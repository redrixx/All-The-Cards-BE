// Imports
var fs = require('fs')
const atc = require('../references/atc.json')

// Database Access
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.API_KEY
)
const superbase = createClient(
    process.env.SUPABASE_URL,
    process.env.SERVICE_KEY
)

// Helper function for advanced search's color_identity requirements
function getCombinations(array) {
    var result = [];   
    var f = function(prefix=[], array) {
        for (var i = 0; i < array.length; i++) {
            result.push([...prefix,array[i]]);       
            f([...prefix,array[i]], array.slice(i + 1));     
        }   
        
    }   
    f('', array);   
    return result; 
}

// Helper function for getting updated prices via Scryfall's API.
async function getUpdatedPrices(card){

    const fetch = require('node-fetch');
    let url = 'https://api.scryfall.com/cards/' + card.id
    let settings = { method: "Get" }

    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            card.prices = json.prices
    })

}

// Helper function for uploading to Supabase bucket.
async function importCardArt(art_crop, png){

    var art_url, png_url

    if(art_crop){
        
        const { error } = await superbase.storage.from(atc.atcStorage).upload(art_crop[0].path, fs.readFileSync(art_crop[0].path), {contentType: art_crop[0].mimetype})
        if(error){
            return {Error: "An unexpected error occured during art_crop file upload."}
        }
        const { data } = superbase.storage.from(atc.atcStorage).getPublicUrl(`storage/cards/${art_crop[0].filename}`)
        art_url = data.publicUrl

    }

    if(png){

        const { error } = await superbase.storage.from(atc.atcStorage).upload(png[0].path, fs.readFileSync(png[0].path), {contentType: png[0].mimetype})
        if(error){
            return {Error: "An unexpected error occured during png file upload."}
        }
        const { data } = superbase.storage.from(atc.atcStorage).getPublicUrl(`storage/cards/${png[0].filename}`)
        png_url = data.publicUrl

    }

    if(art_crop && png){

        fs.unlink(art_crop[0].path, function(err){if(err){console.log(err)}})
        fs.unlink(png[0].path, function(err){if(err){console.log(err)}})

    }

    return {Message: "Card art has been imported successfully.", art_url, png_url}

}

// Helper function for cleanup if there's an error
async function cleaupStorage(){

    const directory = "./storage/cards"
    fs.readdirSync(directory).forEach(f => {
        if(f !== ".gitkeep")
            fs.rmSync(`${directory}/${f}`)
    })

}

// Helper function for removing old art from Supabase bucket.
async function removeCardArt(payload, outdatedArt){

    var artCrop, artPng
    const { data, error } = await supabase.from(atc.atcCustom).select('image_uris').eq('id', payload.id)

    if(data && data.length > 0){

        outdatedArt.art_crop = data[0].image_uris.art_crop
        outdatedArt.png = data[0].image_uris.png

        artCrop = JSON.stringify(data[0].image_uris.art_crop).split("/atc-custom/")[1]
        artPng = JSON.stringify(data[0].image_uris.png).split("/atc-custom/")[1]

        artCrop = artCrop.substring(0, artCrop.length - 1)
        artPng = artPng.substring(0, artPng.length - 1)

    }

    if(!error){

        const { error } = await superbase.storage.from(atc.atcStorage).remove([artCrop])
        if(!error){
            const { error } = await superbase.storage.from(atc.atcStorage).remove([artPng])
            if(error){
                return {Error: "An unexpected error occured during outdated png file removal."}
            }
        }else{
            return {Error: "An unexpected error occured during outdated art_crop file removal."}
        }

        return {Message: "Outdated card art has been removed successfully."}

    }

    return {Error: "An unexpected error occured during outdated card art removal."}

}

// Helper function for retrieving current art from Supabase bucket.
async function retrieveCardArt(cardID){

    const { data, error } = await supabase.from(atc.atcCustom).select('image_uris').eq('id', cardID)

    if(data && data.length > 0){

        return { Data: data[0].image_uris.art_crop }

    }

    return { Error: "An unexpected error occured during card art retrieval." }

}


// Helper Function For Getting Card Cards
async function getFavoriteCount(cardID) {

    var results

    let { data, error } = await supabase
        .from(atc.usersMaster)
        .select('id, username')
        .ilike('favorites->>cards', `%${cardID}%` )

    if (!error) {
        results = data.length
    }

    return results

}


module.exports = {

    // Limited Data Card By ID
    // 
    // Returns: Limited Data Card Object
    getLimitedCard: async function (cardID){

        let { data, error } = await supabase
            .from(atc.atcMaster)
            .select(atc.limitedData)
            .eq('id', cardID)

        if (error) {
            console.log(error)
            return
        }

        return data[0]

    },

    // Card ID Query
    // 
    // Returns: Entire Card Object
    getCardID: async function (req) {

        var cardData, cardError

        if(req.params.cardID && req.params.cardID.startsWith("custom-")){

            let { data, error } = await supabase
            .from(atc.atcCustom)
            .select()
            .eq('id', req.params.cardID)

            cardData = data
            cardError = error

            if(!cardData[0].isApproved){
                return {Message : "This card is currently pending approval. Please check back later."}
            }

        }else{

            let { data, error } = await supabase
            .from(atc.atcMaster)
            .select()
            .eq('id', req.params.cardID)

            cardData = data
            cardError = error

        }

        if (cardError) {
            console.log(cardError)
        }else{
            if(cardData.length > 0){
                cardData[0].favorites = await getFavoriteCount(cardData[0].id)
                if(!req.params.cardID.startsWith("custom-")){
                    await getUpdatedPrices(cardData[0])
                }
            }
        }

        return cardData

    },

    // Cards by UserID Query
    // 
    // Returns: cards by given userID
    cardsByUser: async function (req) {

        let { data, error } = await supabase
            .from(atc.atcCustom)
            .select()
            .eq('author', req.params.userID)

        return data

    },

    // Basic Card Search Query
    // 
    // Returns: limitedData card object
    cardSearch: async function (req) {

        let results = []

        let { data, error } = await supabase
            .from(atc.atcMaster)
            .select(atc.limitedData)
            .ilike('name', '%' + req.params.queryCard + '%')

        if (error) {
            console.log(error)
            return
        }

        results = data

        if(req.headers.includecustom && req.headers.includecustom === 'true'){

            let { data, error } = await supabase
            .from(atc.atcCustom)
            .select()
            .ilike('name', '%' + req.params.queryCard + '%')
            .eq('isApproved', true)

            if (error) {
                console.log(error)
                return
            }

            for(var record in data){results.push(data[record])}

        }

        return results

    },

    // Advanced Card Search Query
    // 
    // Returns: limitedData card object
    cardSearchAdvanced: async function (req) {

        const allQuery = {
            'artist': '*',
            'cmc': '*',
            'color_identity': '*',
            'colors': '*',
            'flavor_text': '*',
            'legalities': '*',
            'name': '*',
            'oracle_text': '*',
            'power': '*',
            'rarity': '*',
            'set_name': '*',
            'set_shorthand': '*',
            'subtype_': '*',
            'toughness': '*',
            'type_': '*'
        }

        for (var key in req.query) {
            allQuery[key] = req.query[key]
        }

        //console.log(allQuery)

        var results = []

        const advancedParameters = {
            'artist': 'artist.ilike.*,artist.is.null',
            'cmc': 'cmc.ilike.*,cmc.is.null',
            'colors': 'colors.ilike.*,colors.is.null',
            'color_identity': 'color_identity.ilike.*,color_identity.is.null',
            'flavor_text': 'flavor_text.ilike.*,flavor_text.is.null',
            'legalities' : 'legalities->>standard.ilike.*',
            'oracle_text': 'oracle_text.ilike.*,oracle_text.is.null',
            'power': 'power.ilike.*,power.is.null',
            'subtype_': 'subtype_one.ilike.*,subtype_two.ilike.*,subtype_one.is.null,subtype_two.is.null',
            'toughness': 'toughness.ilike.*,toughness.is.null',
            'type_': 'type_one.ilike.*,type_two.ilike.*,type_one.is.null,type_two.is.null'
        }

        for (var key in allQuery) {
            if (allQuery[key] !== '*') {
                if (key === 'subtype_') {

                    advancedParameters[key] = `subtype_one.ilike.%${allQuery[key]}%, subtype_two.ilike.%${allQuery[key]}%`

                } else if (key === 'type_') {

                    advancedParameters[key] = `type_one.ilike.%${allQuery[key]}%, type_two.ilike.%${allQuery[key]}%`

                } else if (key === 'colors') {

                    const colors = allQuery[key].split(',')
                    advancedParameters[key] = ''
                    for(var color in colors){
                        if(colors[color] === 'C'){
                            advancedParameters[key] += `${key}.eq.[],card_faces->0->>colors.eq.[],card_faces->1->>colors.eq.[],`
                        }else{
                            advancedParameters[key] += `${key}.ilike.%${colors[color]}%,card_faces->0->>colors.ilike.%${colors[color]}%,card_faces->1->>colors.ilike.%${colors[color]}%,`
                        }
                    }
                    advancedParameters[key] = advancedParameters[key].substring(0, advancedParameters[key].length - 1)

                } else if (key === 'color_identity') {

                    if(allQuery[key] === 'C'){

                        advancedParameters[key] = `${key}.eq.[]`

                    }else{

                        const quoteFix = new RegExp('"', "g");
                        const spaceFix = new RegExp(',', "g");
    
                        if(allQuery[key].includes('C')){
                            allQuery[key] = allQuery[key].substring(0, allQuery[key].length - 2)
                        }

                        const totalCommanders = getCombinations(allQuery[key].split(','))
    
                        advancedParameters[key] = ''
                        for(var commander in totalCommanders){
                            const commanders = JSON.stringify(totalCommanders[commander]).replace(quoteFix, "'").replace(spaceFix, ", ")
                            advancedParameters[key] += `${key}.eq."${commanders}",`
                        }
                        advancedParameters[key] += ` ${key}.eq.[]`

                    }

                } else if (key === 'legalities') {  

                    if(allQuery[key].startsWith('!')){
                        var legalityType = allQuery[key].substring(1)
                        advancedParameters[key] = `${key}->>${legalityType}.eq.not_legal, ${key}->>${legalityType}.eq.banned`
                    }else{
                        advancedParameters[key] = `${key}->>${allQuery[key]}.eq.legal, ${key}->>${allQuery[key]}.eq.restricted`
                    }

                } else {

                    advancedParameters[key] = `${key}.ilike.%${allQuery[key]}%`

                }
            }
        }

        // The Big Boi Search
        let { data, error } = await supabase
        .from(atc.atcMaster)
        .select(atc.limitedData)
        .or(advancedParameters['artist'])
        .or(advancedParameters['cmc'])
        .or(advancedParameters['color_identity'])
        .or(advancedParameters['colors'])
        .or(advancedParameters['flavor_text'])
        .or(advancedParameters['legalities'])
        .ilike('name', '%' + allQuery.name + '%')
        .or(advancedParameters['oracle_text'])
        .or(advancedParameters['power'])
        .ilike('rarity', allQuery.rarity)
        .ilike('set_name', '%' + allQuery.set_name + '%')
        .ilike('set_shorthand', allQuery.set_shorthand)
        .or(advancedParameters['subtype_'])
        .or(advancedParameters['toughness'])
        .or(advancedParameters['type_'])

        results = data

        if (error) {
            console.log(error)
            return
        }

        if(req.headers.includecustom && req.headers.includecustom === 'true'){

            // The Big Boi Search, but with custom cards
            let { data, error } = await supabase
            .from(atc.atcCustom)
            .select()
            .or(advancedParameters['artist'])
            .or(advancedParameters['cmc'])
            .or(advancedParameters['color_identity'])
            .or(advancedParameters['colors'])
            .or(advancedParameters['flavor_text'])
            .or(advancedParameters['legalities'])
            .ilike('name', '%' + allQuery.name + '%')
            .or(advancedParameters['oracle_text'])
            .or(advancedParameters['power'])
            .ilike('rarity', allQuery.rarity)
            .ilike('set_name', '%' + allQuery.set_name + '%')
            .ilike('set_shorthand', allQuery.set_shorthand)
            .or(advancedParameters['subtype_'])
            .or(advancedParameters['toughness'])
            .or(advancedParameters['type_'])
            .eq('isApproved', true)

            if (error) {
                console.log(error)
                return
            }

            for(var record in data){results.push(data[record])}
            
        }

        return results

    },

    // Card Editor Upload
    // 
    // Returns: Message or Error
    createCard: async function (req) {

        if(!req.body.card){ await cleaupStorage(); return { Error: "There is no card data provided." }}
        if(!req.files.art_crop ){ await cleaupStorage(); return { Error: "There is no card art data provided for art_crop." }}
        if(!req.files.png){ await cleaupStorage(); return { Error: "There is no card art data provided for png." }}

        const payload = JSON.parse(req.body.card)

        if(!payload.name){await cleaupStorage(); return {Error: "There is no card name provided."} }
        if(!payload.color_identity){await cleaupStorage(); return {Error: "There is no card color_identity provided."} }
        if(!payload.colors){await cleaupStorage(); return {Error: "There is no card colors provided."} }
        // if(!payload.mana_cost){await cleaupStorage(); return {Error: "There is no card mana_cost provided."} }
        if(!payload.rarity){await cleaupStorage(); return {Error: "There is no card rarity provided."} }
        if(!payload.type_one){await cleaupStorage(); return {Error: "There is no card type_one provided."} }

        var response = {}
        var outdatedArt = {}
        var cardURL

        if(payload.id === null | payload.id === ""){

            // New Card Creation
            date = new Date()
            date = new Date(date.getTime() - date.getTimezoneOffset()*60000);

            if(!payload.author){ payload.author = 'anonymous' }

            var cardImport = await importCardArt(req.files.art_crop, req.files.png)
            if(cardImport.Error){await cleaupStorage(); return cardImport}

            const { data, error } = await supabase
                .from(atc.atcCustom)
                .insert({
                    name: payload.name, 
                    author: payload.author, 
                    border_color: payload.border_color,
                    cmc: payload.cmc,
                    color_identity: payload.color_identity,
                    colors: payload.colors,
                    flavor_text: payload.flavor_text,
                    frame: date.getYear(),
                    frame_effects: payload.frame_effects,
                    image_uris: {art_crop: cardImport.art_url, png: cardImport.png_url},
                    mana_cost: payload.mana_cost,
                    oracle_text: payload.oracle_text,
                    power: payload.power,
                    produced_mana: payload.produced_mana,
                    rarity: payload.rarity,
                    toughness: payload.toughness,
                    type_one: payload.type_one,
                    subtype_one: payload.subtype_one,
                    released_at: date.toISOString()
            }).select()

            if(!error){
                
                cardURL = data[0].id

            }else{

                response = {Error: "An unexpected error occured during card creation."}
                return response

            }

        }else{ // Existing Card Edit

            var cardImport = await importCardArt(req.files.art_crop, req.files.png)
            if(cardImport.Error){await cleaupStorage(); return cardImport}
            var artCleanup = await removeCardArt(payload, outdatedArt)
            if(artCleanup.Error){return artCleanup}

            const { data, error } = await supabase
            .from(atc.atcCustom)
            .update({
                name: payload.name,
                border_color: payload.border_color,
                cmc: payload.cmc,
                color_identity: payload.color_identity,
                colors: payload.colors,
                flavor_text: payload.flavor_text,
                frame_effects: payload.frame_effects,
                image_uris: {art_crop: cardImport.art_url, png: cardImport.png_url},
                mana_cost: payload.mana_cost,
                oracle_text: payload.oracle_text,
                power: payload.power,
                produced_mana: payload.produced_mana,
                rarity: payload.rarity,
                toughness: payload.toughness,
                type_one: payload.type_one,
                subtype_one: payload.subtype_one,
            }).eq('id', payload.id).eq('author', payload.author).select()

            if(!error){
                
                cardURL = data[0].id

            }else{

                response = {Error: "An unexpected error occured during card overwrite."}
                return response

            }

            // Deck Cover Art Fix
            if(true){
                const {data} = await supabase
                .from(atc.deckMaster)
                .select()
                .eq('cover_art', outdatedArt.art_crop)
    
                for(var entry in data){
    
                    data[entry].cover_art = cardImport.art_url
                    const { error } = await supabase
                    .from(atc.deckMaster)
                    .update({ 'cover_art' : cardImport.art_url })
                    .eq('id', data[entry].id)
    
                }
            }

        }

        response = {Message: "Card updated successfully.", "URL" : `/api/get/card/id=${cardURL}`}
        return response

    },

    // Card Editor Delete
    // 
    // Returns: Message or Error
    deleteCard: async function (req) {

        var response = {}
        var outdatedArt = {}

        if(!req.headers.token){

            response = {Error: "No token provided."}
            return response
            
        }else{

            const { data, error } = await supabase.auth.getUser(req.headers.token)
            if(error){ response = {Error: "Invalid token provided."}; return response }
            userData = data

            if(!req.headers.cardid){

                response = {Error: "Invalid cardID provided."}
                return response

            }else{

                // Existing Card Check
                const { data, error } = await supabase
                .from(atc.atcCustom)
                .select()
                .eq('id', req.headers.cardid)
                .eq('author', userData.user.id)

                const cardData = data

                if(cardData) { if(cardData.length === 0) { return { Error: "An unexpected error occured during card removal."}}}

                if(!data | error | !cardData){

                    return {Error: "An unexpected error occured during card removal."}

                }else{  // Proceed with Deletion

                    // Deletion at the Deck Cards Level
                    const{} = await supabase
                    .from(atc.decksMaster)
                    .delete()
                    .eq('card_id', req.headers.cardid)

                    // Deck Cover Art Fix at the Deck Header Level
                    if(true){

                        outdatedArt = await retrieveCardArt(req.headers.cardid)
                        if(outdatedArt.Error) { return { Error: "An unexpected error occured during card art retrieval." } }

                        const {data} = await supabase
                        .from(atc.deckMaster)
                        .select()
                        .eq('cover_art', outdatedArt.Data)

                        for(var entry in data){

                            data[entry].cover_art = "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/0/9/0948e6dc-8af7-45d3-91de-a2aebee83e82.jpg?1559591784"
                            const { error } = await supabase
                            .from(atc.deckMaster)
                            .update({ 'cover_art' : data[entry].cover_art })
                            .eq('id', data[entry].id)

                        }

                    }

                    // Deletion at the Card Favorites Level
                    const{data, error} = await supabase
                        .from(atc.usersMaster)
                        .select('id, favorites')
                        .ilike('favorites->>cards', `%${req.headers.cardid}%`)

                    for(var entry in data){

                        data[entry].favorites.cards = data[entry].favorites.cards.filter(e => e !== req.headers.cardid)
                        const { error } = await supabase
                        .from(atc.usersMaster)
                        .update({ 'favorites' : data[entry].favorites })
                        .eq('id', data[entry].id)

                    }

                    // Final Deletion at the Custom Card Record Level
                    const{} = await supabase
                    .from(atc.atcCustom)
                    .delete()
                    .eq('id', req.headers.cardid)

                }

            }

        response = {Message: "Card deletion successful."}
        return response
        
        }

    },

}