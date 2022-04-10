const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, unique: false},
    lastName: {type: String, unique: false},
    username: {type: String, unique: false},
    email: {type: String, unique: false},
    password: {type: String, unique: false},
    creationDate: {type: String, unique: false},
    collections: [{type: Schema.Types.ObjectId, ref: 'collection', unique: false}],
    decks: [{type: Schema.Types.ObjectId, ref: 'deck', unique: false}],
    trades: [{type: Schema.Types.ObjectId, ref: 'trade', unique: false}]
})

const User = mongoose.model('User', UserSchema)

module.exports = User
