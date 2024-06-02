const express = require('express');
const router = express.Router();
const passport = require('passport');

const { SessionController } = require('../controllers/session.Controller');
const { SessionService } = require('../services/session.Service');
const { SessionStorage } = require('../persistence/session.Storage');

const withController = callback => {
    return (req, res) => {
        const service = new SessionService(new SessionStorage());
        const controller = new SessionController(service);
        return callback(controller, req, res);
    };
};

router.post('/login', withController((controller, req, res) => controller.login(req, res)));

router.post('/register', passport.authenticate('register', { failureRedirect: '/sessions/failregister' }), withController((controller, req, res) => controller.register(req, res)));

router.get('/failregister', withController((controller, req, res) => controller.failRegister(req, res)));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), withController((controller, req, res) => controller.githubCallback(req, res)));

router.post('/reset_password', withController((controller, req, res) => controller.resetPassword(req, res)));

module.exports = {
    configure: app => app.use('/sessions', router)
};


