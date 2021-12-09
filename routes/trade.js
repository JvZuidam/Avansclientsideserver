const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const Trade = require("../src/trade")
const responseMessages = require("../responseMessages")


router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Create a new trade

//Get all trades
router.get("", (request, result) => {
    console.log("Get all trades aangeroepen");
    Trade.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get a trade by id
router.get("", (request, result) => {
    console.log("Get trade by id aangeroepen");
    const tradeId = request.params.id;

    Trade.find({_id: tradeId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update a trade

//Delete a trade
router.delete("/:id", (request, result) => {
    console.log("Delete trade aangeroepen");
    const tradeId = request.params.id;

    Trade.deleteOne({_id: tradeId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

module.exports = router;
