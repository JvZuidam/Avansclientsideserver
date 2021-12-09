const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//TODO: get user later
const Card = require("../src/card");
const responseMessages = require("../responseMessages");
// const checkAuth = require("../middelware/check-auth");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Get cards
router.get("", (request, result) => {
    console.log("Get all cards aangeroepen");
    Card.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get cards by set Name
router.get("/:setname", (request, result) => {
    console.log("Get all cards by set name aangeroepen");
    const setName = request.params.setname;

    Card.find({ card_sets : { $elemMatch: {  set_name : setName } } }, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

router.get("/detail/:id", (request, result) => {
    console.log("Get card details by id");
    const cardId = request.params.id;

    Card.findOne({id: cardId}, function (err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    });
});


module.exports = router;
