const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const { route } = require('./products.Router');
const productManager = new ProductManager();
const io = require('../app').io;


router.get('/', (_, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { title: 'Lista Productos', products, styles: ['style'], scripts: ['script'], useWS: true, scripts: ['index'] })
});


router.post('/addProduct', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body; 
        
        const newProductId = productManager.newId();
        await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
        const newProduct = productManager.getProductById(newProductId);
        res.status(201).json(newProduct);
        io.emit('addProduct', newProduct);
    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        res.status(500).json({ error: 'Error al crear un nuevo producto' });
    }
});



router.delete('/deleteProduct', async (req, res) => {
    try{
        const productId = parseInt(req.params.id);
        
        await productManager.deleteProduct(productId)

        res.json({ message: `Producto con ID ${productId} eliminado correctamente` })

        io.emit('ProductDelete', deleteProduct.id);

    } catch (error){
        console.error('Error al eliminar producto', error);
        res.status(500).json({error: 'Error al eliminar el producto'})
    }  

});

module.exports = router;

