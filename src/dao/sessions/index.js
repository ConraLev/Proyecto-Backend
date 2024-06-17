const MemoryDAO = require('./memory');
const MongoDAO = require('./mongo');

module.exports = {
    createDAO: async (type) => {
        let dao;
        switch (type) {
            case 'mongo':
                dao = new MongoDAO();
                break;
            case 'memory':
                dao = new MemoryDAO();
                break;
            default:
                throw new Error('Unknown storage type');
        }
        await dao.init();
        return dao;
    }
}



