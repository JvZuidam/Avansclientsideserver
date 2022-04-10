const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    trader: {type: Schema.Types.ObjectId, ref: 'user'},
    traderName: {type: String},
    tradee: {type: Schema.Types.ObjectId, ref: 'user'},
    tradeeName: {type: String},
    cardToTrade: {type: String, ref: 'card'},
    cardTradeName: {type: String},
    cardToReceive: {type: String, ref: 'card'},
    cardReceiveName: {type: String},
    deckToTrade: {type: Schema.Types.ObjectId, ref: 'deck'},
    deckTradeName: {type: String},
    deckToReceive: {type: Schema.Types.ObjectId, ref: 'deck'},
    deckReceiveName: {type: String},
    creationDate: String
})

const Trade = mongoose.model('trade', TradeSchema)

module.exports = Trade
