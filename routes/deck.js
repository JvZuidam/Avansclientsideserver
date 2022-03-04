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

    Deck.create({userId: userId, deckName: deckName, numberOfCards: 0, mainDeck: [], extraDeck: [], sideDeck: [], creationDate: moment().format()}, function(err, deckDocs) {
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
router.put("/:id", (request, result) => {
    console.log("Update deck by id aangeroepen");
    const deckId = request.params.id;
    const mainDeckUpdate = request.body.mainDeck;
    const extraDeckUpdate = request.body.extraDeck;
    const sideDeckUpdate = request.body.sideDeck;
    const newDeckName = request.body.deckName;
    const newCardAmount = mainDeckUpdate.length + extraDeckUpdate.length + sideDeckUpdate.length


    Deck.find({_id: deckId}, function(err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            Deck.updateOne({_id: deckId}, { $set: {mainDeck: mainDeckUpdate, extraDeck: extraDeckUpdate, sideDeck: sideDeckUpdate, numberOfCards: newCardAmount}}, function(err, docs) {
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
router.delete("/:id", (request, result) => {
    console.log("Delete a deck aangeroepen");
    const deckId = request.params.id;

    Deck.deleteOne({_id: deckId}, function (err, docs) {
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
