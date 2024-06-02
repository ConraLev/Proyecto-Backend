const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    cartId: { type: String,
         ref: 'Cart' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



