const mongoose = require('mongoose');
const app = require('../app');
const { mongoUrl } = require('../config/dbConfig');
const { MongoDAO } = require('../dao/products/mongo');
const mockSessionMiddleware = require('../middlewares/mockSessionMiddleware');
const request = require('supertest');

describe('Testing Products Router', () => {
    const productDAO = new MongoDAO();
    let connection = null;

    const newProduct = {
        id: 50,
        title: "Nuevo Producto",
        description: "Descripción del nuevo producto",
        price: 100,
        thumbnail: "imagen.jpg",
        code: "ABC123",
        stock: 10,
        category: "Prueba",
        owner: "admin"
    };

    before(async () => {
        const chai = await import('chai');
        global.expect = chai.expect;
        mongooseConnection = await mongoose.connect(mongoUrl, { dbName: 'Testing' });
        connection = mongooseConnection.connection;

        app.use(mockSessionMiddleware);
    });

    after(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await mongoose.connection.db.collection('products').deleteMany({});
    });

    it('GET /products debe devolver array de productos', async () => {
        const res = await request(app).get('/products');
        expect(res.status).to.equal(200);
    });

    it('POST /products debería crear un nuevo producto', async () => {
        const res = await request(app)
            .post('/products')
            .send(newProduct);
        expect(res.status).to.equal(201);
        expect(res.body).to.include(newProduct);
    });

    it('GET /products/:id deberia devolver producto por ID', async () => {
        await productDAO.createOne(newProduct);
        const res = await request(app).get(`/products/${newProduct.id}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include(newProduct);
    });

    it('PUT /products/:id debe actualizar producto por ID', async () => {
        await productDAO.createOne(newProduct);
        const updatedProduct = { ...newProduct, title: "Producto Actualizado" };
        const res = await request(app)
            .put(`/products/${newProduct.id}`)
            .send(updatedProduct);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal(updatedProduct.title);
    });

    it('DELETE /products/:id Deberia borrar un producto por ID', async () => {
        await productDAO.createOne(newProduct);
        const res = await request(app).delete(`/products/${newProduct.id}`);
        expect(res.status).to.equal(200);
        const deletedProduct = await productDAO.getById(newProduct.id);
        expect(deletedProduct).to.be.null;
    });
});
