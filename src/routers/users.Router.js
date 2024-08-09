const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/user.Controller');
const { userIsAdmin } = require('../middlewares/auth.middleware');

function configure(app) {
    const userController = new UserController();

    router.get('/', userIsAdmin, userController.getAllUsers);

    router.get('/admin', userIsAdmin, userController.adminView);

    router.put('/premium/:uid', userController.changeUserRole);

    router.post('/:uid/role', userController.changeUserRole);

    router.post('/:uid/delete', userController.deleteUser);

    router.post('/delete-inactive', userIsAdmin, userController.deleteInactiveUsers);

    app.use('/users', router);
}


module.exports = { configure };