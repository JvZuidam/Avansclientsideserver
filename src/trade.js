const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    userId: String,
    trader: {type: Schema.Types.ObjectId, ref: 'user'},
    tradee: {type: Schema.Types.ObjectId, ref: 'user'},
    cardToTrade: {type: Schema.Types.ObjectId, ref: 'card'},
    cardToReceive: {type: Schema.Types.ObjectId, ref: 'card'},
    deckToTrade: {type: Schema.Types.ObjectId, ref: 'deck'},
    deckToReceive: {type: Schema.Types.ObjectId, ref: 'deck'},
    creationDate: String
})

const Trade = mongoose.model('trade', TradeSchema)

module.exports = Trade
