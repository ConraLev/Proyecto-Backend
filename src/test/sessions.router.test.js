const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Sessions Router', () => {
    it('Deberia registrar el usuario con credenciales validas', async () => {
        const response = await request(app)
            .post('/sessions/register')
            .send({
                username: 'tester@gmail.com',
                password: 'password123'
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
    });

    it('Deberia no registrar el usuario por credenciales invalidas', async () => {
        const response = await request(app)
            .post('/sessions/register')
            .send({
                username: '',
                password: ''
            });
        expect(response.status).to.equal(400);
    });

    it('Deberia ingresar con credenciales validas', async () => {
        const response = await request(app)
            .post('/sessions/login')
            .send({
                username: 'tester@gmail.com',
                password: 'password123'
            });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });

    it('Deberia no ingresar por credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/sessions/login')
            .send({
                username: 'wronguser',
                password: 'wrongpassword'
            });
        expect(response.status).to.equal(401);
    });
});

