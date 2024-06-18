const User = require('../dao/models/user.model');
const Cart = require('../dao/models/carts.model');
const { generateToken } = require('../utils/jwt');
const { isValidPassword } = require('../utils/hashing');
const { createError, errorHandler } = require('../services/errors/errorHandler');

const adminUser = { email: 'adminCoder@coder.com', password: 'adminCod3r123', role: 'admin', firstName: 'Admin', lastName: 'Coder' };

class SessionController {

    constructor(SessionService){
        this.service = SessionService;
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        if (email === adminUser.email && password === adminUser.password) {
            req.session.user = adminUser;
            res.redirect('/products');
        } else {
            try {
                const user = await this.service.findUserByEmail(email);
                if (!user) {
                    throw createError('INVALID_CREDENTIALS');
                }

                if (!isValidPassword(password, user.password)) {
                    throw createError('INVALID_PASSWORD');
                }

                req.session.user = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id.toString(),
                    role: user.role
                };

                const credentials = {
                    email: user.email,
                    _id: user._id.toString(),
                    role: user.role
                };
                const token = generateToken(credentials);
                res.redirect('/products');
            } catch (error) {
                console.error('Error al buscar usuario en la base de datos:', error);
                next(error);
            }
        }
    }


    async register(req, res, next) {
        const { email, firstName, lastName, _id, role } = req.user;
        req.session.user = { email, firstName, lastName, _id: _id.toString(), role };

        try {
            const newCart = new Cart({ userId: _id, items: [] });
            const savedCart = await newCart.save();

            await User.findByIdAndUpdate(_id, { cartId: savedCart._id });
            res.redirect('/products');
        } catch (error) {
            console.error('Error al registrar usuario y/o carrito:', error);
            next(error);
        }
    }

    failRegister(_, res) {
        res.send('Error al registrar el usuario');
    }

    async githubCallback(req, res, next) {
        try {
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                _id: req.user._id.toString(),
                role: req.user.role
            };
            res.redirect('/products');
        } catch (error) {
            console.error('Error en el callback de GitHub:', error);
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        try {
            const user = await this.service.findUserByEmail(email);
            if (!user) {
                throw createError('INVALID_CREDENTIALS');
            }

            await this.service.updateUserPassword(email, password);
            res.redirect('/');
        } catch (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            next(error);
        }
    }
}

module.exports = { SessionController };