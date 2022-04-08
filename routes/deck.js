const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const Deck = require("../src/deck")
const responseMessages = require("../responseMessages")
const moment = require("moment");
const User = require("../src/user");
const {request} = require("express");

router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Create a deck
router.post("/new", (request, result) => {
    console.log("Create a new deck aangeroepen");
    const userId = request.body.userId;
    const deckName = request.body.deckName;
    const mainDeck = request.body.mainDeck;
    const extraDeck = request.body.extraDeck;
    const sideDeck = request.body.sideDeck;
    const numberOfCards = mainDeck.length + sideDeck.length + extraDeck.length;

    Deck.create({userId: userId, deckName: deckName, numberOfCards: numberOfCards, mainDeck: mainDeck, extraDeck: extraDeck, sideDeck: sideDeck, creationDate: moment().format()}, function(err, deckDocs) {
        if (err) {
            responseMessages.ErrorCode500(result)
        } else {
            User.updateOne({_id: userId}, {"$push": { "decks": deckDocs._id } }, function (err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode201Deck(result, deckName)
                }
            })
        }
    })
})


//Get all decks
router.get("/:userid", (request, result) => {
    console.log("Get all decks aangeroepen");
    const userId = request.params.userid;

    Deck.find({userId: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get a deck by Id
router.get("/:userid/:id", (request, result) => {
    console.log("Get a deck by id aangeroepen");
    const deckId = request.params.id;
    const userId = request.params.userid;

    Deck.find({_id: deckId, userId: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update a deck
router.put("/:userid/:id", (request, result) => {
    console.log("Update deck by id aangeroepen");
    const userId = request.params.userid;
    const deckId = request.params.id;
    const mainDeckUpdate = request.body.mainDeck;
    const extraDeckUpdate = request.body.extraDeck;
    const sideDeckUpdate = request.body.sideDeck;
    const newDeckName = request.body.deckName;
    const newCardAmount = mainDeckUpdate.length + extraDeckUpdate.length + sideDeckUpdate.length

    Deck.find({_id: deckId, userId: userId}, function(err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            //TODO: Check if newDeckName is empty and if it's not, update the deckName as well
            Deck.updateOne({_id: deckId,}, { $set: {deckName: newDeckName, mainDeck: mainDeckUpdate, extraDeck: extraDeckUpdate, sideDeck: sideDeckUpdate, numberOfCards: newCardAmount}}, function(err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode200UpdateDeck(result, mainDeckUpdate, sideDeckUpdate, extraDeckUpdate)
                }
            })
        }
    })
})
//Delete a deck
router.delete("/:userId/:id", (request, result) => {
    console.log("Delete a deck aangeroepen");
    const deckId = request.params.id;
    const userId = request.params.userid;

    Deck.deleteOne({_id: deckId, userId: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            User.updateOne({decks: deckId}, {$pull: { decks: deckId } }, function (err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode204(result)
                }
            })
        }
    })
});

module.exports = router;
