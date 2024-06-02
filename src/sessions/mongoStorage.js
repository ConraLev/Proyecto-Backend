const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const { dbName, mongoUrl } = require('../config/dbConfig');

mongoose.connect(mongoUrl, { dbName })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

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

