const express = require('express');
const router = express.Router();
const User = require('../../dao/models/user.model');
const { hashPassword, isValidPassword } = require('../utils/hashing');
const passport = require('passport');


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
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            if(!isValidPassword(password, user.password)){
                return res.status(401).json({ error: 'Contraseña Incorrecta'})
            }

            req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role };
            res.redirect('/products');
        } catch (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
 

/* router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = hashPassword(password);

        const user = new User({
            firstName,
            lastName,
            age: +age,
            email,
            password: hashedPassword
        });

        await user.save();
        req.session.user = { email: user.email, firstName: user.firstName, lastName: user.lastName, _id: user._id.toString(), role: user.role }

        res.redirect('/products');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}); */


router.post('/register', passport.authenticate('register',{failureRedirect:'/sessions/failregister'}), async (req, res) =>{
    res.redirect('/products')
})

router.get('/failregister', (_, res) => {
    res.send('Error al registrar el usuario')
})

router.post('/reset_password', async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Credenciales inválidas' });
            }

    await User.updateOne( { email}, { $set: { password: hashPassword(password)}})
    
    res.redirect('/')
})




module.exports = router;
