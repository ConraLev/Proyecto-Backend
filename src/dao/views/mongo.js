const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');
const ViewsModel = require('../models/views.model');

class MongoDAO {
    async init() {
        await mongoose.connect(mongoUrl, { dbName });
    }

    async renderHomePage() {
        return ViewsModel.findOne({ page: 'home' });
    }

}

module.exports = { MongoDAO };