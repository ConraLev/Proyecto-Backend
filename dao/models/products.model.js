const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
  id: {type: Number, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  price:  { type: Number, required: true },
  thumbnail: String,
  code:  { type: String, required: true },
  stock: { type: Number, required: true },
  category:  { type: String, required: true },
});


const Products = mongoose.model('products', productSchema);


module.exports = Products;