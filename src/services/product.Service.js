class ProductService {

    constructor(storage){
        this.storage = storage;
    }

    async getAll(){
        return this.storage.getAll();
    }

    getById(id){
        return this.storage.getById(id);
    }

    deleteById(id){
        return this.storage.deleteById(id);
    }

    createOne(title, description, price, thumbnail, code, stock, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            throw new Error('invalid parameters');
        }
        return this.storage.createProduct(title, description, price, thumbnail, code, stock, category);
    }

    updateById(productId, updatedFields) {
        if (!productId || !updatedFields) {
            throw new Error('invalid parameters');
        }
        return this.storage.updateById(productId, updatedFields);
    }
}

module.exports = { ProductService };
