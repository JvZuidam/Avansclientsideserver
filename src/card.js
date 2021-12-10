const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    id: Number,
    name: String,
    type: String,
    desc: String,
    race: String,
    archetype: String,
    card_sets: [
        {
            set_name: String,
            set_code: String
        }
    ],
    card_images: [
        {
            image_url: String,
            image_url_small: String
        }
    ]
})

const Card = mongoose.model('card', CardSchema)

module.exports = Card;
