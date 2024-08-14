const { CustomError } = require('../services/errors/customError');
const Product = require('../dao/models/products.model');  
const TicketModel = require('../dao/models/ticket.model');


class CartController {
    constructor(service) {
        this.service = service;
    }

    #handleError(res, err) {
        console.error('Error:', err); 
        if (err instanceof CustomError) {
            return res.status(err.code).json({ error: err.message, details: err.details });
        }

        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }

    async getCartById(req, res) {
        try {
            const isLoggedIn = req.session.user
            const cartId = req.params.id;
            const cart = await this.service.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            const productIds = [...new Set(cart.products.map(item => item.productId))]; // Eliminar duplicados
            const productIdsAsNumbers = productIds.map(id => Number(id));
            const products = await Product.find({ id: { $in: productIdsAsNumbers } }).lean();
    
            const productMap = new Map(products.map(product => [product.id.toString(), product]));
    
            const cartItems = cart.products.reduce((acc, item) => {
                const product = productMap.get(item.productId.toString());
                const existingItem = acc.find(i => i.productId === item.productId);
    
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    acc.push({
                        productId: item.productId,
                        quantity: item.quantity,
                        title: product ? product.title : 'Desconocido',
                        price: product ? product.price : 0
                    });
                }
    
                return acc;
            }, []);
    
            const totalPrice = cartItems.reduce((total, item) => {
                return total + (item.price || 0) * item.quantity;
            }, 0);

    
            res.render('cart', {
                cart: {
                    items: cartItems,
                    totalPrice
                },
                cartId: cartId,
                styles: ['cartStyle'],
                scripts: ['indexCart'],
                isLoggedIn: isLoggedIn,
                user: req.session.user,
                useSweetAlert: true
            });
        } catch (error) {
            this.#handleError(res, error);
        }
    }
    
    async addItemToCart(req, res) {
        const cartId = req.params.cartId;
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        try {
            const cart = await this.service.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            const product = await Product.findOne({id: productId});
            if (!product) {
                throw new Error('Product not found');
            }
    
            if (userRole === 'premium' && product.owner.toString() === userId.toString()) {
                throw new CustomError(403, 'No puedes agregar tu propio producto premium al carrito');
            }
    
            const updatedCart = await this.service.addItemToCart(cartId, productId, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async deleteItemFromCart(req, res) {
        const { cartId, productId } = req.params;
        
        try {
            const updatedCart = await this.service.removeItemFromCart(cartId, productId);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error en deleteItemFromCart:', error); 
            this.#handleError(res, error);
        }
    }

    async clearCart(req, res) {
        const cartId = req.params.cartId;
        try {
            const updatedCart = await this.service.clearCart(cartId);
            res.json(updatedCart);
        } catch (error) {
            this.#handleError(res, error);
        }
    }

    async purchase(req, res) {
        const cartId = req.params.cartId;
        const userId = req.user._id;
    
        try {
            const cart = await this.service.getCartById(cartId);
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: 'El carrito está vacío o no se encontró' });
            }
    
            const productsToUpdate = [];
    
            for (const item of cart.products) {
                const product = await Product.findOne({ id: item.productId });
                if (!product) {
                    return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
                }
    
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Stock insuficiente para el producto: ${product.title}` });
                }
    
                productsToUpdate.push({ product, quantity: item.quantity });
            }
    
            for (const { product, quantity } of productsToUpdate) {
                product.stock -= quantity;
                await product.save();
            }
    
            const totalAmount = productsToUpdate.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            const code = `TICKET-${Date.now()}`;
    
            const ticket = new TicketModel({
                code,
                amount: totalAmount,
                purchaser: userId,
                products: productsToUpdate.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                purchase_datetime: new Date()
            });
    
            await ticket.save();
    
            await this.service.clearCart(cartId);
    
            res.status(200).json({ message: 'Compra realizada con éxito', ticket });
        } catch (error) {
            this.#handleError(res, error);
        }
    }
      
    async getCartAsJson(req, res) {
        try {
            const cartId = req.params.id;
            const cart = await this.service.getCartById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            res.json(cart);
        } catch (error) {
            console.error('Error al obtener el carrito como JSON:', error);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }
    
}

module.exports =  { CartController };
