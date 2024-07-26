const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); 
const { mongoUrl } = require('../config/dbConfig');
const { MongoDAO } = require('../dao/products/mongo');

describe('Testing Products Router', () => {
    const productDAO = new MongoDAO()
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

    // before(async () => {
    //     const chai = await import('chai');
    //     global.expect = chai.expect;
    //     mongooseConnection = await mongoose.connect(mongoUrl, { dbName: 'Testing' });
    //     connection = mongooseConnection.connection;
    // });

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

        await productDAO.createOne(newProduct)
    
    });


    it('GET /products/:id deberia devolver producto por ID', async () => {

        await productDAO.createOne(newProduct);
        const producto = await productDAO.getById(50);
    });


    it('PUT /products/:id debe actualizar producto por ID', async () => {

        await productDAO.createOne(newProduct);
        const updatedProduct = await productDAO.updateById(50, { title: "Casco de moto Premium Actualizado" });
   
    });

    it('DELETE /products/:id Deberia borrar un producto por ID', async () => {
  
        await productDAO.createOne(newProduct);
        const deleteProduct = await productDAO.deleteById(50)
    });
});









