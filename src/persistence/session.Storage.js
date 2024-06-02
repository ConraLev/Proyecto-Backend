const User = require('../dao/models/user.model');

class SessionStorage {

    async findUserByEmail(email) {
        return User.findOne({ email });
    }

    async updateUserPassword(email, hashedPassword) {
        return User.updateOne({ email }, { $set: { password: hashedPassword } });
    }
}

module.exports = { SessionStorage };



