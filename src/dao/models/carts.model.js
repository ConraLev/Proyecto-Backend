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
            default: 1,
            required: true
        }
    }],
    userId: { type: String,
         ref: 'User', required: true 
        }
});


const Carts = mongoose.model('carts', cartSchema);

module.exports = Carts;