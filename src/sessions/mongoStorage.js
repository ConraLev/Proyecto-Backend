const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const { mongoUrl } = require('../config/dbConfig');

const store = MongoStore.create({
    mongoUrl,
    mongoOption:{
        useNewUrlParser: true,
        useUnifiedTopology: true},
        ttl: 1000,
        })

const sessionMiddleware = session({
    store: store,
    secret: 'adasd127812be', 
    resave: false, 
    saveUninitialized: false
});



module.exports = sessionMiddleware;

