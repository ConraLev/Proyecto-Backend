const { DateModule } = require('@faker-js/faker');
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
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cartId: { type: String,
         ref: 'Cart' 
    },
    lastConnection: {type: Date,
        default: Date.now
    }
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;



