const moment = require("moment");

function ErrorCode401(result) {
    result.status(401).json({
        code: 401,
        message: "Unauthorized to execute this action",
        datetime: moment().format()
    });
}

function ErrorCode401Auth(result) {
    result.status(401).json({
        code: 401,
        message: "Authentication failed",
        datetime: moment().format()
    });
}

function ErrorCode404(result) {
    result.status(404).json({
        code: 404,
        message: "Not found, Document does not exist",
        datetime: moment().format()});
}

function ErrorCode409DuplicateUser(result) {
    result.status(409).json({
        code: 409,
        message: "Conflict, User already exists",
        datetime: moment().format()})
}

function ErrorCode412(result) {
    result.status(412).json({
        code: 412,
        message: "Een of meer properties in de request body ontbreken of zijn foutief",
        datetime: moment().format("Y-mm-D:hh:mm:ss")
    });
}

function ErrorCode412SameValues(result) {
    result.status(412).json({
        code: 412,
        message: "Current and new values are not allowed to the be same",
        datetime: moment().format()
    });
}

function ErrorCode422(result) {
    result.status(422).json({
        code: 422,
        message: "Unprocessable entity",
        datetime: moment().format()
    });
}

function ErrorCode500(result) {
    result.status(500).json({
        code: 500,
        message: "Internal server error",
        datetime: moment().format()
    })
}
function SuccessCode200User(result, username, newPassword) {
    result.status(200).json({
        code: 200,
        message: {username: username, password: newPassword,},
        datetime: moment().format()
    });
}

function SuccessCode200GetAll(result, docs) {
    result.status(200).json({
        code: 200,
        results: docs,
        datetime: moment().format()
    });
}

function SuccessCode200Auth(result, token, docs) {
    result.status(200).json({
        code: 200,
        results: docs,
        token: token,
        datetime: moment().format()
    });
}

function SuccessCode200UpdateCollection(result, collectionName, locked) {
    result.status(200).json({
        code: 200,
        message: {updatedCollectionName: collectionName, updatedLocked: locked},
        datetime: moment().format()
    });
}

function SuccessCode200UpdateDeck(result, mainDeck, sideDeck, extraDeck, deckName = "No new Name") {
    result.status(200).json({
        code: 200,
        message: {updatedDeckName: deckName, updatedMainDeck: mainDeck, updatedSideDeck: sideDeck, updatedExtraDeck: extraDeck},
        datetime: moment().format()
    });
}

function SuccessCode200UpdateTrade(result, itemToTrade, itemToReceive) {
    result.status(200).json({
        code: 200,
        message: {updatedItemToTrade: itemToTrade, updatedItemToReceive: itemToReceive},
        datetime: moment().format()
    });
}

function SuccessCode201User(result, username) {
    result.status(201).json({
        code: 201,
        message: {username: username,},
        datetime: moment().format()
    });
}

function SuccessCode201Deck(result, deckName) {
    result.status(201).json({
        code: 201,
        message: {deckName: deckName, mainDeck: [], sideDeck: [], extraDeck: []},
        datetime: moment().format()
    });
}

function SuccessCode201Collection(result, collectionName, setName) {
    result.status(201).json({
        code: 201,
        message: {collectionName: collectionName, setName: setName},
        datetime: moment().format()
    });
}

function SuccessCode201Trade(result, firstUser, secondUser, itemToTrade, itemToReceive) {
    result.status(201).json({
        code: 201,
        message: {trader: firstUser, tradee: secondUser, itemToTrade: itemToTrade, itemToReceive: itemToReceive},
        datetime: moment().format()
    });
}

function SuccessCode204(result) {
    result.status(204).end();
}

module.exports = {
    ErrorCode401,
    ErrorCode401Auth,
    ErrorCode404,
    ErrorCode409DuplicateUser,
    ErrorCode412,
    ErrorCode412SameValues,
    ErrorCode422,
    ErrorCode500,
    SuccessCode200User,
    SuccessCode200GetAll,
    SuccessCode200Auth,
    SuccessCode200UpdateCollection,
    SuccessCode200UpdateDeck,
    SuccessCode200UpdateTrade,
    SuccessCode201User,
    SuccessCode201Collection,
    SuccessCode201Deck,
    SuccessCode201Trade,
    SuccessCode204
};
