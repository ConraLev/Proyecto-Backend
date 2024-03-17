const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const productsRouter = require('./products.Router');
const productManager = new ProductManager();
const products = productsRouter.products;
const fs = require('fs')
/* const io = require('../app').io; */



router.get('/', (_, res) => {
    const products = productManager.getProducts();
    res.render('home', { title: 'Lista Productos', products, styles: ['style'], scripts: ['script'], useWS: false, scripts: ['index'] })
});

router.get('/realtimeproducts', (_, res) => {
    const products = productManager.getProducts();
    res.render('realtimeproducts', { title: 'Lista Actualizacion', products, styles: ['style'], scripts: ['script'], useWS: true, scripts: ['indexRealTime'] })
});



/* router.post('/addProduct', (req, res) => {
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
        productManager.addProduct(id, title, description, price, thumbnail, code, stock, category);
        wsServer.emit('addProduct', newProduct);  
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error);
        res.status(500).send('Error al agregar un nuevo producto');
    }
}); */


router.post('/addProduct', (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        // Aquí podrías realizar la validación de los datos si es necesario

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
        

        fs.readFile('./products.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            const products = JSON.parse(data);
            products.push(newProduct); 

            /* fs.writeFile('./products.json', JSON.stringify(products), (err) => {
                if (err) {
                    console.error(err);
                }
                wsServer.emit('updateProducts', products);
            }); */
        }); 

        
        // Luego, podrías guardar esta lista de productos en tu archivo JSON si es necesario

        res.status(201).json(newProduct); // Devuelve el nuevo producto creado como respuesta
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

