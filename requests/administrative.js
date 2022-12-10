// Database Access
const atc = require('../references/atc.json')
const { createClient } = require('@supabase/supabase-js')
const superbase = createClient(
    process.env.SUPABASE_URL,
    process.env.SERVICE_KEY
)

// Validating Developer Token
async function validateDev(token){

    var userData
    const { data, error } = await superbase.auth.getUser(token)
    if(!error){ userData = data }
    if(userData){

        const { data, error } = await superbase.from(atc.usersMaster).select()
        .eq('id', userData.user.id)
        .eq('isDev', true)

        if(data && data.length > 0){
            return true
        }

    }

    return false
}

// Sub-Function Call for updating prices.
async function performPriceUpdate(cardID, response){

    let { data } = await superbase.from(atc.atcMaster).select('id, prices').eq('id', cardID)
    var cardData

    if(data && data.length > 0){

        cardData = data[0]

        const fetch = require('node-fetch');
        let url = 'https://api.scryfall.com/cards/' + cardID
        let settings = { method: "Get" }
        await fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                cardData.prices = json.prices
        })

        let { error } = await superbase.from(atc.atcMaster).update({prices: cardData.prices}).eq('id', cardID)

        if(error){ return {Error: "An unexpected error occured during pricing update."}}

        response[cardID] = "Pricing update successful."

    }else{

        response[cardID] = "No valid target found."

    }

}

// Sub-Function Call for updating legalities.
async function performLegalityUpdate(cardID, response){

    let { data } = await superbase.from(atc.atcMaster).select('id, legalities').eq('id', cardID)
    var cardData

    if(data && data.length > 0){

        cardData = data[0]

        const fetch = require('node-fetch');
        let url = 'https://api.scryfall.com/cards/' + cardID
        let settings = { method: "Get" }
        await fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                cardData.legalities = json.legalities
        })

        let { error } = await superbase.from(atc.atcMaster).update({legalities: cardData.legalities}).eq('id', cardID)

        if(error){ return {Error: "An unexpected error occured during legality update."}}

        response[cardID] = "Legality update successful."

    }else{

        response[cardID] = "No valid target found."

    }

}

// Getting updated prices via Scryfall's API.
async function updatePrices(req){

    var response = {}

    if(req.headers.target && req.headers.target !== null){

        if(req.headers.target.indexOf(',') > -1){

            var targetArray = req.headers.target.split(',')

            for(var cardID in targetArray){

                await performPriceUpdate(targetArray[cardID], response)

            }

        }else{

            await performPriceUpdate(req.headers.target, response)

        }

    }else{

        response = {Error: "No target provided."}

    }

    return response

}

// Getting updated legalities via Scryfall's API.
async function updateLegalities(req){

    var response = {}

    if(req.headers.target && req.headers.target !== null){

        if(req.headers.target.indexOf(',') > -1){

            var targetArray = req.headers.target.split(',')

            for(var cardID in targetArray){

                await performLegalityUpdate(targetArray[cardID], response)

            }

        }else{

            await performLegalityUpdate(req.headers.target, response)

        }

    }else{

        response = {Error: "No target provided."}

    }

    return response

}

module.exports = {

    // Handle Administrative Calls
    handleAdmin: async function (req){

        if(req.headers.access_key && req.headers.access_key === process.env.SERVICE_KEY && req.headers.token && await validateDev(req.headers.token)){
            
            switch(req.headers.call){

                default: console.log("No call requested."); break

                case 'updateLegalities': return await updateLegalities(req);
                
                case 'updatePrices': return await updatePrices(req);
                
            }

        }else{

            return {Error: "Invalid credentials provided."}
            
        }

    },

}