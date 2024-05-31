const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../dao/models/user.model');
const { hashPassword, isValidPassword } = require('../utils/hashing');
const { generateToken, /* verifyToken */ } = require('../utils/jwt')


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

            const credentials = { email: user.email, _id: user._id.toString(), role: user.role };
            const token = generateToken(credentials);
            /* res.redirect('/products', token); */
            res.json({ token });



        } catch (error) {
            console.error('Error al buscar usuario en la base de datos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
 




router.post('/register', passport.authenticate('register',{failureRedirect:'/sessions/failregister'}), async (req, res) =>{
    const { email, firstName, lastName, _id, role } = req.user;
    req.session.user = { email, firstName, lastName, _id: _id.toString(), role };
    res.redirect('/products')
})

router.get('/failregister', (_, res) => {
    res.send('Error al registrar el usuario')
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/'}), async (req, res) => {
    req.session.user = {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        _id: req.user._id.toString(),
        role: req.user.role
      };
    res.redirect('/products')
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
