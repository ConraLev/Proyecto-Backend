class ViewsController {
    constructor(ViewsService) {
        this.service = ViewsService;
    }

    #handleError(res, err) {
        return res.status(500).json({ error: err.message });
    }

    async renderHomePage(req, res) {
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        res.render('index', {
            title: 'Login',
            styles: ['loginStyle'],
            useWS: false,
            scripts: ['index'],
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        });
    }

    async renderResetPasswordPage(req, res) {
        res.render('resetpass', {
            title: 'Reset Password',
            styles: ['resetPassStyle']
        });
    }

    async renderRegisterPage(req, res) {
        res.render('register', {
            title: 'Register',
            styles: ['registerStyle'],
            useWS: false
        });
    }

    async renderProfilePage(req, res) {
        try {
            if (!req.session || !req.session.user) {
                return res.redirect('/');
            }

            const userId = req.session.user._id;
            const user = await this.service.findUserById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.render('profile', {
                title: 'My profile',
                user: user
            });
        } catch (error) {
            console.error('Error al obtener perfil de usuario:', error);
            this.#handleError(res, error);
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

    async renderRealtimeProductsPage(_, res) {
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
            console.error('Error al obtener los productos en tiempo real:', error);
            this.#handleError(res, error);
        }
    }

    async renderChatPage(req, res) {
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
            console.error('Error al obtener los últimos mensajes:', error);
            this.#handleError(res, error);
        }
    }
}

module.exports = { ViewsController };
