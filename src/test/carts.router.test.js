// const request = require('supertest');
// const app = require('../app');
// const mongoose = require('mongoose');
// const { mongoUrl } = require('../config/dbConfig');

// describe('Carts Router', () => {
//   let expect;

//   before(async () => {
//     const chai = await import('chai');
//     expect = chai.expect;
//     mongooseConnection = await mongoose.connect(mongoUrl, { dbName: 'Testing' });
//     connection = mongooseConnection.connection;
//   });


//   it('Debe encontrar un carrito', async () => {
//     const cartId = "6697016c13bc0dba783754b2"; 

//     const response = await request(app)
//       .get(`/carts/${cartId}`)
//       .expect('Content-Type', "application/json; charset=utf-8");

//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('_id');
//     expect(response.body._id).to.equal(cartId);
//   });

//   it('Debe agregar un producto al carrito', async () => {
//     const response = await request(app)
//         .post('/carts/6697016c13bc0dba783754b2/item')
//         .send({
//             productId: 25,
//             quantity: 2
//         });
//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('products');
// });
// });
