const { MongoDAO: ContactDAO } = require('./mongo')

const createDAO = async () => {
    const dao = new ContactDAO()
    await dao.init()
    return dao
}

module.exports = { createDAO }