const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SetSchema = new Schema({
    set_name: String,
    set_code: String,
    num_of_cards: Number,
    tcg_date: Date
})

const Set = mongoose.model('set', SetSchema)

module.exports = Set;
