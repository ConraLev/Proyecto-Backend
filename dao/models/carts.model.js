const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});


const Carts = mongoose.model('carts', cartSchema);

module.exports = Carts;