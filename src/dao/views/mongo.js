const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');


class MongoDAO {
    async init() {
        await mongoose.connect(mongoUrl, { dbName });
    }

}

module.exports = { MongoDAO };