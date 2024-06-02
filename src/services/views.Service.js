class ViewsService {
    constructor(storage) {
        this.storage = storage;
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
