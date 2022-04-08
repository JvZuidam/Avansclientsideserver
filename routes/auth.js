const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken")

const responseMessages = require("../responseMessages");
const User = require("../src/user");

const config =


router.use (bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}))

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post("/register", (request, result) => {
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
                if (err) {
                    console.log(err);
                    responseMessages.ErrorCode500(result);
                } else {
                    responseMessages.SuccessCode201User(result, username)
                }
            })
        }
    })
})

router.post("/login", (request, result) => {
    console.log("user login aangeroepen");
    const email = request.body.email;
    const password = request.body.password;

    console.log(email);
    console.log(password);

    User.find({email: email, password: password}, function(err, docs) {
        if (err || docs == null) {
            responseMessages.ErrorCode404(result);
        } else {
            const token = jwt.sign({ user_id: docs[0]._id, email }, "Secret123", {expiresIn: "2h",});
            // save user token

            // return new user
            return result.status(200).send({token: token, userId: docs[0]._id, email: email})
        }
    })
})

router.post("/verify", (request, result) => {
    console.log("verify token aangeroepen");
    const token = request.body.token;

    if (!token) {
        return result.status(403).send("A token is required for authentication");
    }
    try {
        jwt.verify(token, "Secret123");
        return result.status(200).send(true)
    } catch (err) {
        return result.status(401).send(false);
    }
})

module.exports = router;
