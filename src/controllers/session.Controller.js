const User = require('../dao/models/user.model');
const Cart = require('../dao/models/carts.model');
const { generateToken } = require('../utils/jwt');
const { isValidPassword } = require('../utils/hashing');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendMail = require('../utils/mailer');

const adminUser = { email: 'adminCoder@coder.com', password: 'adminCod3r123', role: 'admin', firstName: 'Admin', lastName: 'Coder' };

class SessionController {

    constructor(SessionService) {
        this.service = SessionService;
    }

    async changeUserRole(userId, newRole) {
        try {
            if (newRole !== 'user' && newRole !== 'premium') {
                throw new Error('Rol inválido. Debe ser "user" o "premium"');
            }

            const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    if (email === adminUser.email && password === adminUser.password) {
        req.session.user = adminUser;
        return res.redirect('/products');
    }

    try {
        const user = await this.service.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Correo no registrado' });
        }

        if (!isValidPassword(password, user.password)) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const cart = await Cart.findOne({ userId: user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        user.lastConnection = Date.now();
        await user.save();

        req.session.user = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id.toString(),
            role: user.role,
            cartId: cart._id.toString()
        };

        req.session.cartId = cart._id.toString();  

        const credentials = {
            email: user.email,
            _id: user._id.toString(),
            role: user.role
        };
        const token = generateToken(credentials);
        res.redirect('/products');
    } catch (error) {
        console.error('Error en login:', error);
        next(error);
    }
    }

    async githubCallback(req, res, next) {
        try {
            req.user.lastConnection = Date.now();
            await req.user.save();
            
            const cart = await Cart.findOne({ userId: req.user._id });
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            req.session.user = {
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                _id: req.user._id.toString(),
                role: req.user.role,
                cartId: cart._id.toString()
            };
    
            const credentials = {
                email: req.user.email,
                _id: req.user._id.toString(),
                role: req.user.role
            };
            const token = generateToken(credentials);
    
            res.redirect('/products');
        } catch (error) {
            console.error('Error en el callback de GitHub:', error);
            next(error);
        }
    }
    
    async register(req, res, next) {
        const { email, firstName, lastName, _id, role } = req.user;
    
        try {
            const newCart = new Cart({ userId: _id, items: [] });
            const savedCart = await newCart.save();

            await User.findByIdAndUpdate(_id, { cartId: savedCart._id });
            
            req.session.user = {  email, firstName, lastName, _id: _id.toString(), role, cartId: newCart._id.toString() } 

            res.redirect('/products');
        } catch (error) {
            console.error('Error al registrar usuario y/o carrito:', error);
            next(error);
        }
    }
    
    async requestResetPassword(req, res, next) {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' });
        }
        
        try {
            const user = await this.service.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            const resetLink = `${process.env.CALLBACKURL}/reset_password?token=${token}`;
            await sendMail(email, 'Restablecer Contraseña', `<a href="${resetLink}">Restablecer Contraseña</a>`);
            
            return res.json({ message: 'Enlace de restablecimiento de contraseña enviado a tu correo electrónico' });
            
        } catch (error) {
            console.error('Error al generar el enlace de restablecimiento de contraseña:', error);
            next(error);
        }
    }
    
    async resetPassword(req, res, next) {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({ error: 'La nueva contraseña debe ser diferente de la anterior' });
            }
            
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            
            return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'El enlace ha expirado, solicita un nuevo restablecimiento de contraseña' });
            }
            console.error('Error al restablecer la contraseña:', error);
            return res.status(500).json({ error: 'Error al restablecer la contraseña' });
        }
    }
    
    failRegister(_, res) {
        res.send('Error al registrar el usuario');
    }
    
    renderResetPasswordPage(req, res, next) {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Token es requerido');
        }
        
        res.render(('resetpassres', {
            title: 'Restablecer Contraseña',
            styles: ['resetPassStyle'],
            scripts: ['resetPassRes']
        }), { token });
        
    }
}

module.exports = { SessionController };


