const mongoose = require('mongoose');
const { validateProduct } = require('../test/product.validator');
const { createError } = require('../test/errorHandler');

class ProductController {
    constructor(ProductService) {
        this.service = ProductService;
    }

    #handleError(res, err) {
        if (err instanceof CustomError) {
            return res.status(err.code).json({ error: err.message, details: err.details });
        }

        return res.status(500).json({ error: err.message });
    }

    async getAll(req, res) {
        try {
            const isLoggedIn = ![null, undefined].includes(req.session.user);
            const user = req.session.user;

            const cartId = req.session.cartId;

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

            const totalProducts = await this.service.countDocuments(match);
            const totalPages = Math.ceil(totalProducts / limit);

            const skip = (page - 1) * limit;

            const products = await this.service.find(match, { sort, skip, limit });

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
                cartId: user.cartId,
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
            return this.#handleError(res, error);
        }
    }

    async getById(req, res) {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        try {
            const product = await this.service.getById(productId);
            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json(product);
            }
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async deleteById(req, res) {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        try {
            await this.service.deleteById(productId);
            res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async createOne(req, res) {
        const { title, description, price, thumbnail, code, stock, category } = req.body;

        try {
            
            const validationErrors = validateProduct({ title, description, price, thumbnail, code, stock, category });

            if (validationErrors.length > 0) {
                return this.#handleError(res, createError('MISSING_REQUIRED_FIELDS', validationErrors));
            }


            const producto = await this.service.createOne(title, description, price, thumbnail, code, stock, category);
            return res.json(producto);
        } catch (error) {
            return this.#handleError(res, error);
        }
    }

    async updateOne(req, res) {
        const productId = req.params.id;
        const updatedFields = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        try {
            const updatedProduct = await this.service.updateById(productId, updatedFields);

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json(updatedProduct);
        } catch (error) {
            return this.#handleError(res, error);
        }
    }
}

module.exports = { ProductController };
