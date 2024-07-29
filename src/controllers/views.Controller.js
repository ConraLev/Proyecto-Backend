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
        const { token } = req.query;
    
        try {
            if (!token) {
                return res.render('resetpassreq', {
                    title: 'Reset Password',
                    styles: ['resetPassStyle'],
                    scripts: ['resetPassReq']
                });
            }
    
            return res.render('resetpassres', {
                title: 'Reset Password',
                styles: ['resetPassStyle'],
                scripts: ['resetPassRes'],
                token: token
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

    async renderProductsPage(req, res, next) {
        try {
            const isLoggedIn = !!req.session.user;
            const user = req.session.user || {};
            const cartId = req.session.user ? req.session.user.cartId : null;
    
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const sort = req.query.sort === 'desc' ? -1 : 1;
            const query = req.query.query || '';
            const category = req.query.category || '';
            const availability = req.query.availability || '';
    
            const match = {};
            if (query) {
                match.$or = [
                    { category: { $regex: query, $options: 'i' } },
                    { availability: { $regex: query, $options: 'i' } }
                ];
            }
            if (category) {
                match.category = { $regex: category, $options: 'i' };
            }
            if (availability) {
                match.availability = { $regex: availability, $options: 'i' };
            }
    
            const totalProducts = await this.service.countDocuments(match);
            const totalPages = Math.ceil(totalProducts / limit);
    
            const skip = (page - 1) * limit;
    
            const products = await this.service.find(match, { sort, skip, limit });
    
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
    
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;
    
            const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
    
            res.render('home', {
                title: 'Lista Productos',
                products,
                user: user,
                cartId: cartId,
                styles: ['style'],
                useWS: false,
                scripts: ['index'],
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn
            });
        } catch (error) {
            console.error('Error al obtener y renderizar la página de productos:', error);
            next(error);
        }
    }

    async countDocuments(match) {
        return this.storage.countDocuments(match);
    }

    async find(match, options) {
        return this.storage.find(match, options);
    }



}

module.exports = { ViewsController };
