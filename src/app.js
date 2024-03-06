
const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const productsRouter = require('./router/productsRouter');
const cartsRouter = require('./router/cartsRouter');
const port = 8080;
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('Conectado al servidor');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});