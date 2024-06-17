class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getById(productId) {
        return await this.dao.getById(productId);
    }

    async addItem(item) {
        return await this.dao.addItem(item);
    }

}

module.exports = ProductRepository;
