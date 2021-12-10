const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const moment = require("moment");
const mongoose = require("mongoose")

const Collection = require("../src/collection")
const User = require("../src/user")
const Card = require("../src/card")
const responseMessages = require("../responseMessages")

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
                   console.log(cardDocs);
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
router.get ("", (request, result) => {
    console.log("Get all collections aangeroepen");

    Collection.find({}, function(err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    });
});

//Get collection by Id
router.get("/:id", (request, result) => {
    console.log("Get collection by id aangeroepen");
    const collectionId = request.params.id;

    Collection.find({_id: collectionId}, function( err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    });
});

//Update collection
router.put("/:id", (request,result) => {
    console.log("update collection aangeroepen");
    const collectionId = request.params.id;
    const newCollectionName = request.body.collectionName;
    const newLocked = request.body.locked;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result)
    } else if (newCollectionName == null) {
    //    Only change the locked state
        Collection.update({_id: collectionId},{$set: {locked: newLocked}}, function (err, docs) {
            if (err) {
                responseMessages.ErrorCode500(result)
            } else {
                responseMessages.SuccessCode200UpdateCollection(result, "", newLocked)
            }
        })
    } else if(newLocked == null) {
    //    Only change the collectionName
        Collection.update({_id: collectionId}, {$set: {collectionName: newCollectionName}}, function (err, docs) {
            if (err) {
                responseMessages.ErrorCode500(result)
            } else {
                responseMessages.SuccessCode200UpdateCollection(result, newCollectionName, "")
            }
        })
    } else {
    //    Update both collection name and locked state
        Collection.update({_id: collectionId}, {$set: {collectionName: newCollectionName, locked: newLocked}}, function (err, docs) {
            if (err) {
                responseMessages.ErrorCode500(result)
            } else {
                responseMessages.SuccessCode200UpdateCollection(result, newCollectionName, newLocked)
            }
        })
    }
})

//Update a card inside the collection

//Delete collection
router.delete("/:id", (request, result) => {
    console.log("Delete collection aangeroepen");
    const collectionId = mongoose.Types.ObjectId(request.params.id);

    Collection.deleteOne({_id: collectionId}, function (err, docs) {
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
