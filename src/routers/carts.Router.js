const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Products = require('../dao/models/products.model');
const Carts = require('../dao/models/carts.model');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Carts({ products: req.body.products });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creando carrito:', error);
        res.status(500).json({ error: 'Error creando carrito' });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({ error: 'ID de carrito no válido' });
        }
        
        const cart = await Carts.findById(cartId).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

// Agregar producto a un carrito especifico
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Carts.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }
        await cart.save();

        res.json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ error: 'Error al agregar al carrito' });
    }
});

// Eliminar producto específico de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Carts.findByIdAndUpdate(cartId, { $pull: { products: { productId } } }, { new: true });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Actualizar carrito con arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;
        const cart = await Carts.findByIdAndUpdate(cartId, { products }, { new: true });
        res.json(cart);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
});

// Actualizar cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const cart = await Carts.findById(cartId);
        
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = cart.products.find(item => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        product.quantity = quantity;
        await cart.save();

        res.json({ message: 'Cantidad de producto actualizada en el carrito correctamente' });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await Carts.findByIdAndUpdate(cartId, { products: [] });
        res.json({ status: 'success', message: 'Se eliminaron todos los productos del carrito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
});

module.exports = router;
