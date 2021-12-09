const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    userId: String,
    collectionName: String,
    collectionSetName: String,
    creationDate: String,
    numberOfCards: Number,
    cards: [],
    locked: Boolean
})

const Collection = mongoose.model('collection', CollectionSchema)

module.exports = Collection
