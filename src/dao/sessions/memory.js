const MongoDAO = require('./mongo');

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
        return this.sessions.find(user => user.email === email);
    }

    async updateUserPassword(email, password) {
        const user = this.sessions.find(user => user.email === email);
        if (user) {
            user.password = password;
            return user;
        }
        return null;
    }

    async getById(sessionId) {
        return this.sessions.find(user => user.id === sessionId);
    }

    async create(session) {
        this.sessions.push(session);
        return session;
    }

    async delete(sessionId) {
        this.sessions = this.sessions.filter(user => user.id !== sessionId);
    }
}

module.exports = MemoryDAO;
