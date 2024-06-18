const { createError } = require('../services/errors/errorHandler');

class ViewsController {
    constructor(ViewsService) {
        this.service = ViewsService;
    }

    async renderHomePage(req, res, next) {
        try {
            const isLoggedIn = ![null, undefined].includes(req.session.user);

            res.render('index', {
                title: 'Login',
                styles: ['loginStyle'],
                useWS: false,
                scripts: ['index'],
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn
            });
        } catch (error) {
            console.error('Error al renderizar la página de inicio:', error);
            next(error);
        }
    }

    async renderResetPasswordPage(req, res, next) {
        try {
            res.render('resetpass', {
                title: 'Reset Password',
                styles: ['resetPassStyle']
            });
        } catch (error) {
            console.error('Error al renderizar la página de reseteo de contraseña:', error);
            next(error);
        }
    }

    async renderRegisterPage(req, res, next) {
        try {
            res.render('register', {
                title: 'Register',
                styles: ['registerStyle'],
                useWS: false
            });
        } catch (error) {
            console.error('Error al renderizar la página de registro:', error);
            next(error);
        }
    }

    async renderProfilePage(req, res, next) {
        try {
            if (!req.session || !req.session.user) {
                return res.redirect('/');
            }

            const userId = req.session.user._id;
            const user = await this.service.findUserById(userId);

            if (!user) {
                throw createError('USER_NOT_FOUND');
            }

            res.render('profile', {
                title: 'My profile',
                user: user
            });
        } catch (error) {
            console.error('Error al obtener y renderizar el perfil de usuario:', error);
            next(error);
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            }
            res.redirect('/');
        });
    }

    failRegister(_, res) {
        res.send('Error al registrar el usuario');
    }

    async renderRealtimeProductsPage(_, res, next) {
        try {
            const products = await this.service.findAllProducts();
            res.render('realtimeproducts', {
                title: 'Lista Actualizacion',
                products,
                styles: ['style'],
                useWS: true,
                scripts: ['indexRealTime']
            });
        } catch (error) {
            console.error('Error al obtener y renderizar los productos en tiempo real:', error);
            next(error);
        }
    }

    async renderChatPage(req, res, next) {
        try {
            const lastMessages = await this.service.findLastMessages();
            res.render('chat', {
                title: 'Chat',
                styles: ['style'],
                useWS: true,
                useSweetAlert: true,
                scripts: ['indexChat'],
                lastMessages
            });
        } catch (error) {
            console.error('Error al obtener y renderizar los últimos mensajes del chat:', error);
            next(error);
        }
    }
}

module.exports = { ViewsController };
