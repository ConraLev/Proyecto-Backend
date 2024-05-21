<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const ProductManager = require('../../dao/FileSystem/ProductManager');
const productManager = new ProductManager();
const Products = require('../../dao/models/products.model');
const { verifyToken } = require('../utils/jwt');


//Obtener listado de todos los productos o limitarlo por cantidad


/* router.get('/',  async (req, res) => {
    try {
        
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const user = req.session.user;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';

        const match = {};
        if (query) {
            match.$or = [
                { category: { $regex: query, $options: 'i' } },
                { availability: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) {
            match.category = { $regex: category, $options: 'i' };
        }
        if (availability) {
            match.availability = { $regex: availability, $options: 'i' };
        }

        const totalProducts = await Products.countDocuments(match).lean();
        const totalPages = Math.ceil(totalProducts / limit);

        const skip = (page - 1) * limit;

        const products = await Products.find(match).lean()
            .sort({ price: sort })
            .skip(skip)
            .limit(limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;

   

        res.render('home', {
            title: 'Lista Productos',
            products,
            user: user,
            styles: ['style'],
            useWS: false,
            scripts: ['index'],
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        });


    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
}); */


router.get('/', verifyToken, async (req, res) => {
    try {
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const user = req.session.user;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';

        const match = {};
        if (query) {
            match.$or = [
                { category: { $regex: query, $options: 'i' } },
                { availability: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) {
            match.category = { $regex: category, $options: 'i' };
        }
        if (availability) {
            match.availability = { $regex: availability, $options: 'i' };
        }

        const totalProducts = await Products.countDocuments(match).lean();
        const totalPages = Math.ceil(totalProducts / limit);

        const skip = (page - 1) * limit;

        const products = await Products.find(match).lean()
            .sort({ price: sort })
            .skip(skip)
            .limit(limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;

        res.render('home', {
            title: 'Lista Productos',
            products,
            user: user,
            styles: ['style'],
            useWS: false,
            scripts: ['index'],
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

module.exports = router;




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
=======
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ProductManager = require('../../dao/FileSystem/ProductManager');
const productManager = new ProductManager();
const mongoose = require('mongoose');
const Products = require('../../dao/models/products.model');



//Obtener listado de todos los productos o limitarlo por cantidad


router.get('/', async (req, res) => {
    try {
        
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const user = req.session.user;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';

        const match = {};
        if (query) {
            match.$or = [
                { category: { $regex: query, $options: 'i' } },
                { availability: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) {
            match.category = { $regex: category, $options: 'i' };
        }
        if (availability) {
            match.availability = { $regex: availability, $options: 'i' };
        }

        const totalProducts = await Products.countDocuments(match).lean();
        const totalPages = Math.ceil(totalProducts / limit);

        const skip = (page - 1) * limit;

        const products = await Products.find(match).lean()
            .sort({ price: sort })
            .skip(skip)
            .limit(limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&availability=${availability}` : null;

   

        res.render('home', {
            title: 'Lista Productos',
            products,
            user: user,
            styles: ['style'],
            useWS: false,
            scripts: ['index'],
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        });


    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
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
>>>>>>> 18993a74b582ed4c144252be27fd0f23930ab01f
