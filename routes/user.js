const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const moment = require("moment");

const User = require("../src/user")
const responseMessages = require("../responseMessages");

router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Create new user
router.post("/new", (request, result) => {
    console.log("Create a new user aangeroepen");
    const firstName = request.body.firstname;
    const lastName = request.body.lastname;
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;

    User.findOne({email: email}, function (err, docs) {
        if (err || docs != null) {
            responseMessages.ErrorCode409DuplicateUser(result);
        } else {
            User.create({firstName: firstName, lastName: lastName, username: username, email: email, password: password, creationDate: moment().format(), collections: [], decks: [], trades: []}, function (err, docs) {
                if (err || docs == null) {
                    responseMessages.ErrorCode500(result);
                } else {
                    responseMessages.SuccessCode201User(result, username)
                }
            })
        }
    })
})

//Get all users
router.get("", (request, result) => {
    console.log("Get all users aangeroepen");

    User.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});
//Get user by id
router.get("/:id", (request, result) => {
    const userId = request.params.id;
    console.log("Get user by id aangeroepen");

    User.find({_id: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update user

//Delete user
router.delete("/:id", (request, result) => {
    const userId = request.params.id;
    console.log("Delete all users aangeroepen");

    User.deleteOne({_id: userId}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

module.exports = router;
