const express = require('express');
const router = express.Router();
const fs = require('fs');
const ProductManager = require('../../dao/FileSystem/ProductManager');
const productManager = new ProductManager();
const Products = require('../../dao/models/products.model');
const mongoose = require('mongoose');


//Obtener listado de todos los productos o limitarlo por cantidad


router.get('/', async (req, res) => {
    const limit = req.query.limit;

    try {
        let products;

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (isNaN(parsedLimit)) {
                return res.status(400).json({ error: 'Debe ser un número válido' });
            }
            products = await Products.find().limit(parsedLimit);
        } else {
            products = await Products.find();
        }

        res.json(products);
    } catch (error) {
        console.error('Error al leer los productos:', error);
        res.status(500).json({ error: 'Error al leer los productos' });
    }
});



//Obtener productos por ID


router.get('/:id', async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        const product = await Products.findOne({ id: productId });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

//Cargar productos 

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const newProductId = await productManager.newId();
         const newProduct = new Products({
            id: newProductId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            category: category
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);

        /* FS ProductManager = try {
             Carga de productos a traves del Product Manager
            const { title, description, price, thumbnail, code, stock, category } = req.body; 
            
            const newProductId = productManager.newId();
            await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
            const newProduct = productManager.getProductById(newProductId);
            
            res.status(201).json(newProduct); 
        }  */

    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        res.status(500).json({ error: 'Error al crear un nuevo producto' });
    }
});



//Actualizar producto por ID

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;

        const updatedProduct = await Products.findByIdAndUpdate(productId, updatedFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

//Borrar producto por ID

// router.delete('/:id', async (req, res) => {
//     try{
//         const productId = req.params.id;
//         const deletedProduct = await Product.findByIdAndDelete(productId);
//         if (!deletedProduct) {
//             return res.status(404).json({ error: `No se encontró el producto con ID ${productId}` });
//         }
//         /* const productId = parseInt(req.params.id);
//         await productManager.deleteProduct(productId) */

//         res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
//     } catch (error){
//         console.error('Error al eliminar producto', error);
//         res.status(500).json({error: 'Erro al eliminar el producto'})
//     }  

// });

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Products.findOneAndDelete({id: productId});

        if (!deletedProduct) {
            return res.status(404).json({ error: `No se encontró el producto con ID ${req.params.id}` });
        }

        res.json({ message: `Producto con ID ${req.params.id} eliminado correctamente` });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }  
});



module.exports = router;
