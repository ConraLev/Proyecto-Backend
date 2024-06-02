
const Products = require('../dao/models/products.model');

class ProductStorage {

    async getAll(){
        return Products.find({}).lean();
    }

    async getById(productId){
        return Products.findOne({ id: productId }).lean();
    }

    async deleteById(productId){
        return Products.findOneAndDelete({ id: productId }).lean();
    }

    async createProduct(title, description, price, thumbnail, code, stock, category) {
        const lastProduct = await Products.findOne({}, {}, { sort: { 'id': -1 } });
        const newProductId = lastProduct ? lastProduct.id + 1 : 1;

        const newProduct = new Products({
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        });

        return newProduct.save();
    }

    async updateById(productId, updatedFields) {
        return Products.findOneAndUpdate({ id: productId }, updatedFields, { new: true }).lean();
    }
}

module.exports = { ProductStorage };



