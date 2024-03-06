const express = require('express');
const router = express.Router();
const fs = require('fs');
const ProductManager = require('./../ProductManager');
const productManager = new ProductManager();

//Obtener listado de todos los productos o limitarlo por cantidad

router.get('/', (req, res) => {
    const limit = req.query.limit;
    let products = [];

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos' });
        }
        products = JSON.parse(data);

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                products = products.slice(0, parsedLimit);
            } else {
                return res.status(400).json({ error: 'Debe ser un número válido' });
            }
        }

        res.json(products);
    });
});

//Obtener productos por ID

router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id); 

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer el producto' });
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });
});

//Cargar productos 

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body; 

        const newProductId = productManager.newId();
        await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
        const newProduct = productManager.getProductById(newProductId);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        res.status(500).json({ error: 'Error al crear un nuevo producto' });
    }
});


//Actualizar producto por ID

router.put('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updatedFields = req.body;

        await productManager.updateProduct(productId, updatedFields);

        const updatedProduct = productManager.getProductById(productId);

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

//Borrar producto por ID

router.delete('/:id', async (req, res) => {
    try{
        const productId = parseInt(req.params.id);
        
        await productManager.deleteProduct(productId)

        res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error){
        console.error('Error al eliminar producto', error);
        res.status(500).json({error: 'Erro al eliminar el producto'})
    }  

});


module.exports = router;
