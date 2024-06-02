const User = require('../dao/models/user.model');
const { generateToken } = require('../utils/jwt');
const { isValidPassword } = require('../utils/hashing');
const adminUser = { email: 'adminCoder@coder.com', password: 'adminCod3r123', role: 'admin', firstName: 'Admin', lastName: 'Coder' };

class SessionController {

    constructor(SessionService){
        this.service = SessionService;
    }

    #handleError(res, err) {
        if (err.message === 'not found') {
            return res.status(404).json({ error: 'Not found' });
        }

        if (err.message === 'invalid parameters') {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        return res.status(500).json({ error: err.message });
    }

    async login(req, res) {
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
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }

                if (!isValidPassword(password, user.password)) {
                    return res.status(401).json({ error: 'Contraseña Incorrecta' });
                }

                req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role };

                const credentials = { email: user.email, _id: user._id.toString(), role: user.role };
                const token = generateToken(credentials);
                res.json({ token });

            } catch (error) {
                console.error('Error al buscar usuario en la base de datos:', error);
                this.#handleError(res, error);
            }
        }
    }

    async register(req, res) {
        const { email, firstName, lastName, _id, role } = req.user;
        req.session.user = { email, firstName, lastName, _id: _id.toString(), role };
        res.redirect('/products');
    }

    failRegister(req, res) {
        res.send('Error al registrar el usuario');
    }

    async githubCallback(req, res) {
        req.session.user = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            _id: req.user._id.toString(),
            role: req.user.role
        };
        res.redirect('/products');
    }

    async resetPassword(req, res) {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        try {
            const user = await this.service.findUserByEmail(email);
            if (!user) {
                return res.status(400).json({ error: 'Credenciales inválidas' });
            }

            await this.service.updateUserPassword(email, password);
            res.redirect('/');
        } catch (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            this.#handleError(res, error);
        }
    }
}

module.exports = { SessionController };