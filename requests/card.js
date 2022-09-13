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

// Helper Function for Flip Cards
async function flipCards(cardID, data, index) {

    // Since card_faces was proving time and time again to fail, this will grab the entry via Scryfall's API.
    const fetch = require('node-fetch');
    let url = 'https://api.scryfall.com/cards/' + cardID
    let settings = { method: "Get" }

    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            data[index].card_faces = json.card_faces
        })

}


module.exports = {

    // Card ID Query
    // 
    // Returns: Entire Card Object
    getCardID: async function (req) {

        let { data, error } = await supabase
            .from(atcMaster)
            .select()
            .eq('id', req.params.cardID)

        if (error) {
            console.log(error)
            return
        }

        // Since card_faces was proving time and time again to fail, this will grab the entry via Scryfall's API.
        const fetch = require('node-fetch');
        let url = 'https://api.scryfall.com/cards/' + req.params.cardID
        let settings = { method: "Get" }

        await fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                data[0].card_faces = json.card_faces
            })

        return data;

    },

    // Basic Card Search Query
    // 
    // Returns: id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects
    cardSearch: async function (req) {

        const results = []

        let { data, error } = await supabase
            .from(atcMaster)
            .select('id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects')
            .ilike('name', '%' + req.params.queryCard + '%')

        results[0] = data

        if (error) {
            console.log(error)
            return
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].card_faces !== null) {
                await flipCards(data[i].id, data, i);
            }
        }

        return results[0]

    },

    // Advanced Card Search Query
    // 
    // Returns: id, name, image_uris, color_identity, set_shorthand, set_type, card_faces, layout, frame, promo, lang, border_color, frame_effects
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

        const results = []

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
                        advancedParameters[key] += `${key}.ilike.%${colors[color]}%,`
                    }
                    advancedParameters[key] = advancedParameters[key].substring(0, advancedParameters[key].length - 1)

                } else if (key === 'color_identity') {

                    const quoteFix = new RegExp('"', "g");
                    const spaceFix = new RegExp(',', "g");
                    const commanders = JSON.stringify(allQuery[key].split(',')).replace(quoteFix, "'").replace(spaceFix, ", ")
                    advancedParameters[key] = `${key}.eq."${commanders}"`

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

        // "Best Case Scenario Search"
        let { data, error } = await supabase
            .from(atcMaster)
            .select('id, name, artist, border_color, card_faces, cmc, color_identity, colors, flavor_text, frame, frame_effects, image_uris, lang, layout, legalities, oracle_text, power, promo, rarity, set_name, set_shorthand, set_type, toughness, type_one, type_two, subtype_one, subtype_two')
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

        results[0] = data

        if (error) {
            console.log(error)
            return
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].card_faces !== null) {
                await flipCards(data[i].id, data, i);
            }
        }

        //console.log('RECORDS : ' + data.length)
        return results[0]

    }

}