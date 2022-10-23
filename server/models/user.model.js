const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isloggedin: {type: Boolean},
        usercolor: {type: String, required: true}
    },
    {collection: 'user-data'}
)

const model = mongoose.model('UserData', User)

module.exports = model