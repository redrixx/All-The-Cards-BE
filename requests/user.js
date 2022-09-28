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

        var response = {Message : {}, Error: {}}
        var userData

        if(!req.headers.token){
            response.Error.Token = 'No token provided.'
        }else{

            const { data, error } = await supabase.auth.getUser(req.headers.token)
            if(error){ response.Error.Token = 'Invalid token provided.'; return response }
            userData = data

            if(!req.body.email){
                response.Message.Email = 'No email provided.'
            }else{
                response.Message.Email = 'Email update attempt.'
            }

            if(!req.body.password){
                response.Message.Password = 'No password provided.'
            }else{
                response.Message.Password = 'Password update attempt.'
            }

            if(!req.body.username){
                response.Message.Username = 'No username provided.'
            }else{

                const { error } = await supabase
                    .from(usersMaster)
                    .update({username : req.body.username})
                    .eq('id', userData.user.id)

                if(!error){ 
                    response.Message.Username = 'Update successful.' 
                }else{ 
                    response.Error.Username = 'An unexpected error occured.' 
                }

            }

            if(!req.body.bio){
                response.Message.Bio = 'No bio provided.'
            }else{

                const { error } = await supabase
                .from(usersMaster)
                .update({bio : req.body.bio})
                .eq('id', userData.user.id)

                if(!error){ 
                    response.Message.Bio = 'Update successful.' 
                }else{ 
                    response.Error.Bio = 'An unexpected error occured.' 
                }

            }

            if(!req.body.name){
                response.Message.Name = 'No name provided.'
            }else{

                const { error } = await supabase
                .from(usersMaster)
                .update({name : req.body.name})
                .eq('id', userData.user.id)

                if(!error){ 
                    response.Message.Name = 'Update successful.' 
                }else{ 
                    response.Error.Name = 'An unexpected error occured.' 
                }

            }

            if(!req.body.location){
                response.Message.Location = 'No location provided.'
            }else{

                const { error } = await supabase
                .from(usersMaster)
                .update({location : req.body.location})
                .eq('id', userData.user.id)

                if(!error){ 
                    response.Message.Location = 'Update successful.' 
                }else{ 
                    response.Error.Location = 'An unexpected error occured.' 
                }

            }

            if(!req.body.avatar){
                response.Message.Avatar = 'No avatar provided.'
            }else{

                const { error } = await supabase
                .from(usersMaster)
                .update({avatar : req.body.avatar})
                .eq('id', userData.user.id)

                if(!error){ 
                    response.Message.Avatar = 'Update successful.' 
                }else{ 
                    response.Error.Avatar = 'An unexpected error occured.' 
                }

            }

        }

        return response

    },

}