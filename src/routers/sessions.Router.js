const express = require('express');
const router = express.Router();
const User = require('../../dao/models/user.model')

const adminUser = { email: 'adminCoder@coder.com', password: 'adminCod3r123', role: 'admin', firstName: 'Admin', lastName: 'Coder' };

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    if (email === adminUser.email && password === adminUser.password) {
        req.session.user = adminUser;
        res.redirect('/products');
    } else {
        try {
            const user = await User.findOne({ email, password });
            if (!user) {
                return res.status(400).json({ error: 'Credenciales inválidas' });
            }

            req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role };
            res.redirect('/products');
        } catch (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
 



router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const user = new User({
            firstName,
            lastName,
            age: +age,
            email,
            password
        });

        await user.save();
        req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role }

        res.redirect('/products');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;
