const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const moment = require("moment");
const mongoose = require("mongoose")

const Collection = require("../src/collection")
const User = require("../src/user")
const Card = require("../src/card")
const responseMessages = require("../responseMessages")
const Deck = require("../src/deck");
const {request} = require("express");
const { ObjectId } = require('mongodb');

router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Create a new collection
router.post("/new", (request, result) => {
    console.log("Create a new collection aangeroepen");
    const userId = request.body.userId;
    const collectionName = request.body.collectionName;
    const setName = request.body.setName;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result)
    } else if (userId != null){
        User.findOne({_id: userId}, function (err, userDocs) {
            if (err || userDocs == null) {
                responseMessages.ErrorCode404(result)
            } else {
               Card.find({card_sets : { $elemMatch: {  set_name : setName } }}, function(err, cardDocs) {
                   if (err || cardDocs == null) {
                        responseMessages.ErrorCode404(result)
                    } else {

                        Collection.create({userId: userId, collectionName: collectionName, collectionSetName: setName, creationDate: moment().format(), numberOfCards: cardDocs.length, cards: cardDocs, locked: false}, function (err, collectiondocs) {
                            if (err || collectiondocs == null) {
                                responseMessages.ErrorCode500(result)
                            } else {
                                User.updateOne({_id: userId}, {"$push": { "collections": collectiondocs._id } }, function (err, docs) {
                                    if (err || docs == null) {
                                        responseMessages.ErrorCode500(result)
                                    } else {
                                        responseMessages.SuccessCode201Collection(result, collectionName, setName)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
});

//Get all collections
router.get ("/:userid", (request, result) => {
    console.log("Get all collections aangeroepen");
    const userId = request.params.userid;

    Collection.find({userId: userId}, function(err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    });
});

//Get collection by Id
router.get("/:userid/:id", (request, result) => {
    console.log("Get collection by id aangeroepen");
    const collectionId = request.params.id;
    const userId = request.params.userid;

    Collection.find({_id: collectionId, userId: userId}, function( err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    });
});

//Update collection
router.put("/:userid/:id", (request,result) => {
    console.log("update collection aangeroepen");
    const collectionId = request.params.id;
    const userId = request.params.userid;

    const newCollectionName = request.body.collectionName;
    const newLocked = request.body.locked;

    Collection.find({_id: collectionId, userId: userId}, function(err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        }  else {
            //Update both collection name and locked state
            Collection.updateOne({_id: collectionId}, { $set: {collectionName: newCollectionName, locked: newLocked}}, function(err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode200UpdateCollection(result, newCollectionName, newLocked)
                }
            })
        }
    })
})

router.put("/card/:id/:cardId", (request, result) => {
    console.log("Update obtained card aangeroepen");
    const collectionId = request.params.id;
    const cardId = request.params.cardId;
    const obtainedValue = request.body.obtainedValue;

    const objectifiedCollectionId = ObjectId(String(collectionId))
    const objectifiedCardId = ObjectId(cardId)

    Collection.find({_id: collectionId}, function(err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        }  else {
            //Update both collection name and locked state
            Collection.updateOne({_id: objectifiedCollectionId, "cards._id": objectifiedCardId}, {$set: {"cards.$.obtained": obtainedValue}}, function(err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode200UpdateObtainedCard(result, cardId, obtainedValue)
                }
            })
        }
    })
})

//Update a card inside the collection

//Delete collection
router.delete("/:userid/:id", (request, result) => {
    console.log("Delete collection aangeroepen");
    const collectionId = mongoose.Types.ObjectId(request.params.id);
    const userId = request.params.userid;

    Collection.deleteOne({_id: collectionId, userid: userId}, function (err, docs) {
        if (err || docs == null) {
            responseMessages.SuccessCode204(result);
        } else {
            User.updateOne({collections: collectionId}, {$pull: { collections: collectionId } }, function (err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode204(result)
                }
            })
        }
    });
});

module.exports = router;
