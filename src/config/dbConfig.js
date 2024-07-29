const { MONGO_URL } = require('./config')

module.exports = {
    dbName: process.env.DBNAME,
    mongoUrl: MONGO_URL
}