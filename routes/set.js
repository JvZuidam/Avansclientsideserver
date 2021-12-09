const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
//TODO: get user later
const Set = require("../src/set");
const responseMessages = require("../responseMessages");
const Card = require("../src/card");
const {set} = require("mongoose");
// const checkAuth = require("../middelware/check-auth");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Get all sets
router.get("", (request, result) => {
    console.log("Get all sets aangeroepen");
    Set.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get specific set by set name
router.get("/:setname", (request, result) => {
    console.log("Get specific set by set name");
    const setName = request.params.setname;

    Set.find({set_name: setName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

module.exports = router;
