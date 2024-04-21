const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');
const Products = require('../../dao/models/products.model');
const Message = require('../../dao/models/messages.model');


router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = [];

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                products = await Products.find().limit(parsedLimit);
            } else {
                return res.status(400).json({ error: 'El parámetro de límite debe ser un número válido' });
            }
        } else {
            products = await Products.find().lean();
        }
        
        res.render('home', { title: 'Lista Productos', products, styles: ['style'], useWS: false, scripts: ['index'] });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Products.find();
        res.render('products', { title: 'Lista de Productos', products });
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener la lista de productos' });
    }
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