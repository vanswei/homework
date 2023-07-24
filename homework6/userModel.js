const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        type: String
    },
    salt: {
        type: String
    }
})
module.exports = mongoose.model('User', userSchema)