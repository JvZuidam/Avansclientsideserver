const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const Trade = require("../src/trade")
const responseMessages = require("../responseMessages")
const User = require("../src/user");
const moment = require("moment");


router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Create a new trade
router.post("/new", (request, result) => {
    console.log("Create a new trade");
    const firstItem = "";
    const secondItem = "";

    const traderId = request.body.traderId;
    const tradeeId = request.body.tradeeId;
    const cardToTrade = request.body.cardToTrade;
    const cardToReceive = request.body.cardToReceive;
    const deckToTrade = request.body.deckToTrade;
    const deckToReceive = request.body.deckToReceive;

    if (cardToTrade == null || cardToReceive == null) {
        // Setting the existing values up for return
        firstItem.concat(deckToTrade);
        secondItem.concat(deckToReceive);
    } else if (deckToTrade == null || deckToReceive == null) {
        // Setting the existing values up for return
        firstItem.concat(cardToTrade);
        secondItem.concat(cardToReceive);
    } else {
        responseMessages.ErrorCode412(result)
    }

    Trade.create({trader: traderId, tradee: tradeeId, cardToTrade: cardToTrade, cardToReceive: cardToReceive, deckToTrade: deckToTrade, deckToReceive: deckToReceive, creationDate: moment().format()}, function (err, tradeDocs) {
        if (err) {
            console.log(err);
            responseMessages.ErrorCode500(result);
        } else {
            User.updateOne({_id: traderId}, {"$push": { "trades": tradeDocs._id } }, function (err, docs) {
                if (err || docs == null) {
                    console.log(err);
                    responseMessages.ErrorCode500(result)
                } else {
                    responseMessages.SuccessCode201Trade(result, traderId, tradeeId, )
                }
            })
        }
    })
})


//Get all trades
router.get("/:userid", (request, result) => {
    console.log("Get all trades aangeroepen");
    const userId = request.params.userid;

    Trade.find({trader: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get a trade by id
router.get("/:userid/:id", (request, result) => {
    console.log("Get trade by id aangeroepen");
    const tradeId = request.params.id;
    const userId = request.params.userid;

    Trade.find({_id: tradeId, trader: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update a trade
router.put("/:userid/:id", (request, result) => {
    console.log("Update trade aangeroepen");
    const userId = request.params.userid;
    const tradeId = request.params.id;
    const deckIdToTrade = request.body.deckToTrade;
    const deckIdToReceive = request.body.deckToReceive;
    const cardIdToTrade = request.body.cardToTrade;
    const cardIdToReceive = request.body.cardToReceive;

    Trade.find({_id: tradeId, trader: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            if (deckIdToTrade == null && deckIdToReceive == null) {
                console.log("inside trade deck");
                Trade.updateOne({_id: tradeId}, {$set: {cardToTrade: cardIdToTrade, cardToReceive: cardIdToReceive}}, function(err, docs) {
                    if (err || docs == null) {
                        responseMessages.ErrorCode500(result)
                    } else {
                        responseMessages.SuccessCode200UpdateTrade(result)
                    }
                })
            } else if (cardIdToTrade == null && cardIdToReceive == null) {
                console.log("inside trade card");
                console.log(deckIdToTrade);
                console.log(deckIdToReceive);
                Trade.updateOne({_id: tradeId}, {$set: {deckToTrade: deckIdToTrade, deckToReceive: deckIdToReceive}}, function(err, docs) {
                    if (err || docs == null) {
                        responseMessages.ErrorCode500(result)
                    } else {
                        responseMessages.SuccessCode200UpdateTrade(result)
                    }
                })
            } else {
                responseMessages.ErrorCode500(result)
            }
        }
    })
})

//Delete a trade
router.delete("/:userid/:id", (request, result) => {
    console.log("Delete trade aangeroepen");
    const tradeId = request.params.id;
    const userId = request.params.userid;

    Trade.deleteOne({_id: tradeId, trader: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            User.updateOne({trades: tradeId}, {$pull: { trades: tradeId } }, function (err, docs) {
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
