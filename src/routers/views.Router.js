const express = require('express');
const router = express.Router();
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');

const { ViewsController } = require('../controllers/views.Controller');
const { ViewsService } = require('../services/views.Service');
const { ViewsStorage } = require('../persistence/views.Storage');

const withController = callback => {
    return (req, res) => {
        const service = new ViewsService(new ViewsStorage());
        const controller = new ViewsController(service);
        return callback(controller, req, res);
    };
};

router.get('/', withController((controller, req, res) => controller.renderHomePage(req, res)));

router.get('/reset_password', userIsNotLoggedIn, withController((controller, req, res) => controller.renderResetPasswordPage(req, res)));

router.get('/register', userIsNotLoggedIn, withController((controller, req, res) => controller.renderRegisterPage(req, res)));

router.get('/profile', withController((controller, req, res) => controller.renderProfilePage(req, res)));

router.get('/logout', withController((controller, req, res) => controller.logout(req, res)));

router.get('/failregister', withController((controller, req, res) => controller.failRegister(req, res)));

router.get('/realtimeproducts', withController((controller, req, res) => controller.renderRealtimeProductsPage(req, res)));

router.get('/chat', withController((controller, req, res) => controller.renderChatPage(req, res)));

module.exports = {
    configure: app => app.use('/', router)
};

