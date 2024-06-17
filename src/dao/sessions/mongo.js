const mongoose = require('mongoose');
const { dbName, mongoUrl } = require('../../config/dbConfig');
const UserModel = require('../models/user.model'); 

class MongoDAO {
    async init() {
        await mongoose.connect(mongoUrl, { dbName });
    }

    async getAll() {
        return UserModel.find({});
    }

    async findUserByEmail(email) {
        return UserModel.findOne({ email });
    }

    async updateUserPassword(email, password) {
        return UserModel.findOneAndUpdate({ email }, { password }, { new: true });
    }

    async getById(sessionId) {
        return UserModel.findById(sessionId);
    }

    async create(session) {
        return UserModel.create(session);
    }

    async delete(sessionId) {
        return UserModel.findByIdAndDelete(sessionId);
    }
}

module.exports = MongoDAO;
