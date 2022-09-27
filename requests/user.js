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

module.exports = {

    // User ID Query
    // 
    // Returns: Information for user page - very basic currently
    getUserID: async function (req) {

        let { data, error } = await supabase
            .from(usersMaster)
            .select()
            .eq('id', req.params.userID)

        if (error) {
            console.log(error)
            return
        }

        return (data)

    },

    // Basic User Search Query
    // 
    // Returns: user_names
    userSearch: async function (req) {

        let { data, error } = await supabase
            .from(usersMaster)
            .select()
            .ilike('username', '%' + req.params.queryUser + '%')

        if (error) {
            console.log(error)
            return
        }

        return data

    },

    // Update User Settings Query
    // 
    // Returns: message or error
    updateUser: async function (req) {

        // "email" : null,
        // "password" : null,
        // "username" : null,
        // "bio" : null,
        // "name" : null,
        // "location" : null,
        // "avatar" : null

        if(!req.headers.token){
            return {Error: 'Invalid token received.'}
        }else{

            const { data } = await supabase.auth.getUser(req.headers.token)
            console.log(data)

            if(!req.body.email){
                console.log('Blank email.')
            }else{

            }

            if(!req.body.password){
                console.log('Blank password.')
            }else{

            }

            if(!req.body.username){
                console.log('Blank username.')
            }else{

            }

            if(!req.body.bio){
                console.log('Blank bio.')
            }else{

            }

            if(!req.body.name){
                console.log('Blank name.')
            }else{

            }

            if(!req.body.location){
                console.log('Blank location.')
            }else{

            }

            if(!req.body.avatar){
                console.log('Blank avatar.')
            }else{

            }

        }

        return {Message: 'Testing...'}

    },

}