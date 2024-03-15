const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const { route } = require('./products.Router');
const productManager = new ProductManager();
/* const io = require('../app').io; */



router.get('/', (_, res) => {
    const products = productManager.getProducts();
    res.render('home', { title: 'Lista Productos', products, styles: ['style'], scripts: ['script'], useWS: true, scripts: ['index'] })
});

router.get('/realtimeproducts', (_, res) => {
    const products = productManager.getProducts();
    res.render('realtimeproducts', { title: 'Lista Actualizacion', products, styles: ['style'], scripts: ['script'], useWS: true, scripts: ['index'] })
});



router.post('/addProduct', (req, res) => {
    try {
        const wsServer = req.app.get('ws');
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const newProductId = productManager.newId(); 
        const newProduct = {
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        };
        productManager.addProduct(title, description, price, thumbnail, code, stock, category);
        wsServer.emit('addProduct', newProduct); 
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error);
        res.status(500).send('Error al agregar un nuevo producto');
    }
});

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const wsServer = req.app.get('ws');
        const productId = parseInt(req.params.id);
        await productManager.deleteProduct(productId);
        res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
        wsServer.emit('ProductDelete', productId);
    } catch (error) {
        console.error('Error al eliminar producto', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }  
});


module.exports = router;

