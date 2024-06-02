const { hashPassword } = require('../utils/hashing');

class SessionService {

    constructor(storage){
        this.storage = storage;
    }

    async findUserByEmail(email) {
        return this.storage.findUserByEmail(email);
    }

    async updateUserPassword(email, password) {
        const hashedPassword = hashPassword(password);
        return this.storage.updateUserPassword(email, hashedPassword);
    }
}

module.exports = { SessionService };
