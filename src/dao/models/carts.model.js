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
    }],
    userId: { type: String,
         ref: 'User', required: true 
        }/* ,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    } */
});


const Carts = mongoose.model('carts', cartSchema);

module.exports = Carts;