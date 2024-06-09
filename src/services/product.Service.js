
class ProductService {
    constructor(storage) {
        this.storage = storage;
    }

    async getAll() {
        return this.storage.getAll();
    }

    getById(id) {
        return this.storage.getById(id);
    }

    deleteById(id) {
        return this.storage.deleteById(id);
    }

    createOne(title, description, price, thumbnail, code, stock, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            throw new Error('invalid parameters');
        }
        return this.storage.createOne({ title, description, price, thumbnail, code, stock, category });
    }

    updateById(productId, updatedFields) {
        if (!productId || !updatedFields) {
            throw new Error('invalid parameters');
        }
        return this.storage.updateById(productId, updatedFields);
    }

    countDocuments(match) {
        return this.storage.countDocuments(match);
    }

    // find(match, { sort, skip, limit }) {
    //     return this.storage.find(match, sort, skip, limit);
    // }

    find(match, { sort, skip, limit }) {
        return this.storage.find(match)
            .then(products => {
                if (sort) {
                    products.sort((a, b) => {
                        if (a.price < b.price) return -sort;
                        if (a.price > b.price) return sort;
                        return 0;
                    });
                }
                return products.slice(skip, skip + limit);
            });
    }
}

module.exports = { ProductService };


