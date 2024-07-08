const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/user.Controller');

function configure(app) {
    const userController = new UserController();

    router.put('/premium/:uid', async (req, res, next) => {
        try {
            const userId = req.params.uid;
            const newRole = req.body.role;

            const updatedUser = await userController.changeUserRole(userId, newRole);

            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    });


    app.use('/users', router);
}

module.exports = { configure };
