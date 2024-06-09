const MemoryDAO = require('./memory');
const { MongoDAO } = require('./mongo');

module.exports = {
    createDAO: async (type) => {
        let dao;
        switch (type) {
            case 'memory':
                dao = new MemoryDAO();
                break;
            case 'mongo':
                dao = new MongoDAO();
                break;
            default:
                throw new Error('Unknown storage type');
        }
        await dao.init();
        return dao;
    }
};
