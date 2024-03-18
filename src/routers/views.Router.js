const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const productsRouter = require('./products.Router');
const productManager = new ProductManager();
const { Server } = require('socket.io');


router.get('/', (_, res) => {
    const products = productManager.getProducts();
    res.render('home', { title: 'Lista Productos', products, styles: ['style'], scripts: ['script'], useWS: false, scripts: ['index'] })
});
    
router.get('/realtimeproducts', (_, res) => {
    const products = productManager.getProducts();
    res.render('realtimeproducts', { title: 'Lista Actualizacion', products, styles: ['style'], scripts: ['script'], useWS: true, scripts: ['indexRealTime'] })
});
    
module.exports = router;

