const mongoose = require('mongoose')
const Schema = mongoose.Schema

const numberSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    number: {
        type: Number
    }
})
module.exports = mongoose.model('Number', numberSchema)