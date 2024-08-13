class ViewsService {
    constructor(storage) {
        this.storage = storage;
    }

    async getAllProducts() {
        return this.storage.getAll();
    }

    countDocuments(match) {
        return this.storage.countDocuments(match);
    }

    find(match, options) {
        return this.storage.find(match, options);
    }

    findUserById(userId) {
        return this.storage.findUserById(userId);
    }

    findAllProducts() {
        return this.storage.findAllProducts();
    }

    findLastMessages() {
        return this.storage.findLastMessages();
    }
}

module.exports = { ViewsService };