const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');
const Products = require('../../dao/models/products.model');
const Message = require('../../dao/models/messages.model');
const User = require('../../dao/models/user.model')


router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', { title: 'Login', styles: ['loginStyle'], useWS: false, scripts: ['index'], isLoggedIn,
    isNotLoggedIn: !isLoggedIn });

})


router.get('/login', (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.render('login', {
        title: 'Login'
    });
});

/* router.get('/register', (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.render('register', {
        title: 'Register'
    });
}); */

router.get('/profile', async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId);

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


router.get('/profile', (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    const user = req.session.user;

    res.render('profile', {
        title: 'My profile',
        user: user
    });
});

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