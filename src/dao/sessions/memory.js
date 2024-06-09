const Sessions = require('../sessions/mongo');

class MemoryDAO {
    constructor() {
        this.sessions = [];
    }

    async init() {
        const mongoDAO = new MongoDAO();
        await mongoDAO.init();
        this.sessions = await mongoDAO.getAll();
    }

    async findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    async updateUserPassword(email, password) {
        const user = this.users.find(user => user.email === email);
        if (user) {
            user.password = password;
            return user;
        }
        return null;
    }

    async getById(sessionId) {
        return this.users.find(user => user.id === sessionId);
    }

    async create(session) {
        this.users.push(session);
        return session;
    }

    async delete(sessionId) {
        this.users = this.users.filter(user => user.id !== sessionId);
    }
}

module.exports = MemoryDAO;

