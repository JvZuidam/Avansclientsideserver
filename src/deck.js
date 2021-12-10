const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    userId: String,
    deckName: String,
    numberOfCards: Number,
    mainDeck: [],
    extraDeck: [],
    sideDeck: [],
    creationDate: String
})

const Deck = mongoose.model('deck', DeckSchema)

module.exports = Deck
