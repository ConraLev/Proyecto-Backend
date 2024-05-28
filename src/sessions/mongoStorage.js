const MongoStore = require('connect-mongo');
const session = require('express-session');
const { dbName, mongoUrl } = require('../dbConfig');

const store = MongoStore.create({
    mongoUrl: mongoUrl,
    dbName: dbName,
    ttl: 1200
});

const sessionMiddleware = session({
    store: store,
    secret: 'adasd127812be', 
    resave: false, 
    saveUninitialized: false
});

module.exports = sessionMiddleware;
