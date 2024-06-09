class MemoryDAO {
    constructor() {
        this.products = [];
    }

    async init() {
        const mongoDAO = new MongoDAO();
        await mongoDAO.init();
        this.products = await mongoDAO.getAll();
    }

    async getAll() {
        return this.products;
    }

    async getById(id) {
        return this.products.find(product => product._id.toString() === id);
    }

    async createOne(product) {
        const newProduct = { ...product, _id: (this.products.length + 1).toString() }; // Ensure ID is a string
        this.products.push(newProduct);
        return newProduct;
    }

    async updateById(id, updatedFields) {
        const index = this.products.findIndex(product => product._id.toString() === id);
        if (index === -1) return null;

        this.products[index] = { ...this.products[index], ...updatedFields };
        return this.products[index];
    }

    async deleteById(id) {
        const index = this.products.findIndex(product => product._id.toString() === id);
        if (index === -1) return null;

        return this.products.splice(index, 1)[0];
    }

    async countDocuments(match) {
        return this.products.filter(product => {
            for (const key in match) {
                const value = match[key];
                if (key === '$or') {
                    if (!value.some(condition => Object.keys(condition).some(field => {
                        const regex = condition[field];
                        return new RegExp(regex.$regex, regex.$options).test(product[field]);
                    }))) {
                        return false;
                    }
                } else if (!new RegExp(value.$regex, value.$options).test(product[key])) {
                    return false;
                }
            }
            return true;
        }).length;
    }

    async find(match, sort, skip, limit) {
        const filteredProducts = this.products.filter(product => {
            for (const key in match) {
                const value = match[key];
                if (key === '$or') {
                    if (!value.some(condition => Object.keys(condition).some(field => {
                        const regex = condition[field];
                        return new RegExp(regex.$regex, regex.$options).test(product[field]);
                    }))) {
                        return false;
                    }
                } else if (!new RegExp(value.$regex, value.$options).test(product[key])) {
                    return false;
                }
            }
            return true;
        });

        const sortedProducts = filteredProducts.sort((a, b) => (a.price - b.price) * sort);

        return sortedProducts.slice(skip, skip + limit);
    }
}

module.exports = { MemoryDAO };


