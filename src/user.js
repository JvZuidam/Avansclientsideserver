const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    creationDate: String,
    collections: [{type: Schema.Types.ObjectId, ref: 'collection'}],
    decks: [{type: Schema.Types.ObjectId, ref: 'deck'}],
    trades: [{type: Schema.Types.ObjectId, ref: 'trade'}]
})

const User = mongoose.model('user', UserSchema)

module.exports = User
