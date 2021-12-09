/*******************************************************
 * Copyright (C) 2021-2020 Jim van Zuidam 2127317
 *
 * This file is part of ClientSideProgrammingIndividueel.
 *
 * ClientSideProgrammingIndividueel can not be copied and/or distributed without the express
 * permission of Jim van Zuidam
 *******************************************************/

const mongoose = require('mongoose')
const envVar = 'test';

mongoose.Promise = global.Promise;

if (envVar === 'testCloud' ||envVar === 'production') {
    mongoose.connect('mongodb+srv://admin:admin@yugiohcardcollectorclus.c2ic5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB Cloud connected")
        })
        .catch(err => console.log(err));
} else if (envVar === 'test') {
    mongoose.connect('mongodb://localhost:27017/YugiohCardCollector',
        {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB Local connected")
        })
        .catch(err => console.log(err));
}

mongoose.connection
    .once('open', () => {
        console.log('Connection opened');
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });


module.exports = mongoose;
