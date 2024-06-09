const express = require('express');
const router = express.Router();
const passport = require('passport');

const configure = (app) => {
    const sessionController = app.get('sessionController');

    if (!sessionController) {
        throw new Error('SessionController is not defined');
    }

    router.post('/login', sessionController.login.bind(sessionController));
    router.post('/register', passport.authenticate('register', { failureRedirect: '/sessions/failregister' }), sessionController.register.bind(sessionController));
    router.get('/failregister', sessionController.failRegister.bind(sessionController));
    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), sessionController.githubCallback.bind(sessionController));
    router.post('/reset_password', sessionController.resetPassword.bind(sessionController));

    app.use('/sessions', router);
};

module.exports = { configure };


