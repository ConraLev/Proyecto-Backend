const dotenv = require('dotenv');
dotenv.config({ path: '../src/config/.dev.env' });

const mongoose = require('mongoose');
const { MongoDAO } = require('../dao/products/mongo');
const { mongoUrl } = require('../config/dbConfig');
const Assert = require('assert');

const assert = Assert.strict;

describe('Testing Product DAO', () => {

    const productDAO = new MongoDAO();
    let connection = null;

    before(async() => {
        mongooseConnection = await mongoose.connect(mongoUrl, { dbName: 'Testing' });
        connection = mongooseConnection.connection;
    });

    after(async() => {
        // await connection.db.dropDatabase();
        await connection.close();
    });

    beforeEach(async () => { 
        await mongoose.connection.db.collection('products').deleteMany({});
    });

    it('El resultado debe ser un array', async() => {
        const result = await productDAO.getAll();
        assert.strictEqual(Array.isArray(result), true);
    });

    it('Debe devolver un producto por ID', async() => {
        const mockProduct = {
            id: 20,
            title: "Casco de moto Premium",
            description: "Casco de seguridad para motociclistas",
            price: 250000,
            thumbnail: "Sin imagen",
            code: "993921",
            stock: 19,
            category: "Indumentaria",
            __v: 0
        };

        await productDAO.createOne(mockProduct);

        const product = await productDAO.getById(20);
        assert.ok(product.id);
        assert.strictEqual(product.id, 20);
    });

    it('Debe crear un nuevo producto', async() => {
        const mockProduct = {
            id: 21,
            title: "Guantes de moto",
            description: "Guantes de cuero para motociclistas",
            price: 150000,
            thumbnail: "Sin imagen",
            code: "993922",
            stock: 10,
            category: "Indumentaria",
            __v: 0
        };

        const createdProduct = await productDAO.createOne(mockProduct);
        assert.ok(createdProduct._id);
        assert.strictEqual(createdProduct.id, 21);
    });

    it('Debe actualizar un producto por ID', async() => {
        const mockProduct = {
            id: 22,
            title: "Botas de moto",
            description: "Botas de cuero para motociclistas",
            price: 200000,
            thumbnail: "Sin imagen",
            code: "993923",
            stock: 5,
            category: "Indumentaria",
            __v: 0
        };

        await productDAO.createOne(mockProduct);

        const updatedProduct = await productDAO.updateById(22, { price: 220000 });
        assert.strictEqual(updatedProduct.price, 220000);
    });

    it('Debe eliminar un producto por ID', async() => {
        const mockProduct = {
            id: 23,
            title: "Chaqueta de moto",
            description: "Chaqueta de cuero para motociclistas",
            price: 300000,
            thumbnail: "Sin imagen",
            code: "993924",
            stock: 8,
            category: "Indumentaria",
            __v: 0
        };

        await productDAO.createOne(mockProduct);

        const deletedProduct = await productDAO.deleteById(23);
        assert.strictEqual(deletedProduct.id, 23);
    });

    it('Debe contar el número de documentos que coinciden con un criterio', async() => {
        const mockProduct = {
            id: 24,
            title: "Casco de moto Premium",
            description: "Casco de seguridad para motociclistas",
            price: 250000,
            thumbnail: "Sin imagen",
            code: "993925",
            stock: 19,
            category: "Indumentaria",
            __v: 0
        };

        await productDAO.createOne(mockProduct);

        const count = await productDAO.countDocuments({ category: "Indumentaria" });
        assert.strict(count, 1);
    });

    it('Debe encontrar productos que coincidan con un criterio', async() => {
        const mockProduct = {
            id: 25,
            title: "Casco de moto Premium",
            description: "Casco de seguridad para motociclistas",
            price: 250000,
            thumbnail: "Sin imagen",
            code: "993926",
            stock: 19,
            category: "Indumentaria",
            __v: 0
        };

        await productDAO.createOne(mockProduct);

        const products = await productDAO.find({ category: "Indumentaria" });
        assert.strict(products.length, 1);
        assert.strict(products[0].id, 25);
    });
});
