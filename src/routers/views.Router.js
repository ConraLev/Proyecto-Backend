const express = require('express');
const router = express.Router();
const ProductManager = require('../../dao/FileSystem/ProductManager');
const productsRouter = require('./products.Router');
const productManager = new ProductManager();
const { Server } = require('socket.io');


router.get('/', (_, res) => {
    const products = productManager.getProducts();
    res.render('home', { title: 'Lista Productos', products, styles: ['style'], useWS: false, scripts: ['index'] })
});
    
router.get('/realtimeproducts', (_, res) => {
    const products = productManager.getProducts();
    res.render('realtimeproducts', { title: 'Lista Actualizacion', products, styles: ['style'], useWS: true, scripts: ['indexRealTime'] })
});

router.get('/chat', (req,  res) =>{
    res.render('chat',{ tittle:'Chat', styles: ['style'], useWS: true, useSweetAlert: true, scripts: ['indexChat']})
})
    
module.exports = router;

