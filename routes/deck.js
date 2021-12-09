const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const Deck = require("../src/deck")
const responseMessages = require("../responseMessages")

router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Create a deck

//Get all decks
router.get("", (request, result) => {
    console.log("Get all decks aangeroepen");
    Deck.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get a deck by Id
router.get("/:id", (request, result) => {
    console.log("Get a deck by id aangeroepen");
    const deckId = request.params.id;

    Deck.find({_id: deckId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update a deck

//Delete a deck
router.delete("/:id", (request, result) => {
    console.log("Delete a deck aangeroepen");
    const deckId = request.params.id;

    Deck.deleteOne({_id: deckId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

module.exports = router;
