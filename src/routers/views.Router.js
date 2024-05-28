const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');
const Products = require('../../dao/models/products.model');
const Message = require('../../dao/models/messages.model');
const User = require('../../dao/models/user.model');
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');
const { verifyToken } = require('../utils/jwt');

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', { title: 'Login',
        styles: ['loginStyle'],
        useWS: false,
        scripts: ['index'],
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn });

});

router.get('/reset_password', userIsNotLoggedIn, (_, res) => {
    res.render('resetpass', {
        title: 'Reset Password',
        styles: ['resetPassStyle']

    });
});


router.get('/register', userIsNotLoggedIn, (_, res) => {
    res.render('register', {
        title: 'Register',
        styles: ['registerStyle'],
        useWS: false
    });
});




router.get('/profile'/* , verifyToken */, async (req, res, next) => {
    try {
        req.session.user = { _id: req.user._id }

        
        /* const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        
        const token = authHeader.split(' ')[1];
        
        const { _id } = req.authHeader */


        if (!req.session || !req.session.user) {
            return res.redirect('/');
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.render('profile', {                                 
            title: 'My profile',
            user: user
        });
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});


router.get('/failregister', (_, res) => {
    res.send('Error al registrar el usuario')
})






router.get('/realtimeproducts', async (_, res) => {
    try {
        const products = await Products.find().lean();
        res.render('realtimeproducts', { title: 'Lista Actualizacion', products, styles: ['style'], useWS: true, scripts: ['indexRealTime'] });
    } catch (error) {
        console.error('Error al obtener los productos en tiempo real:', error);
        res.status(500).json({ error: 'Error al obtener los productos en tiempo real' });
    }
});

router.get('/chat', async (req, res) => {
    try {
        const lastMessages = await Message.find().sort({ createdAt: -1 }).limit(10); 
        res.render('chat', { title: 'Chat', styles: ['style'], useWS: true, useSweetAlert: true, scripts: ['indexChat'], lastMessages });
    } catch (error) {
        console.error('Error al obtener los últimos mensajes:', error);
        res.status(500).json({ error: 'Error al obtener los últimos mensajes del servidor' });
    }
});

module.exports = router;