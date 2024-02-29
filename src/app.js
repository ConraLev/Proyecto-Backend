const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const port = 8080;
const productManager = new ProductManager();

app.get('/', (request, response) => {
    response.send('Conectado al servidor');
});

app.get('/products', (request, response) => {
    let products = productManager.getProducts();
    const limit = request.query.limit;

    if (limit) {
        const parsedLimit = parseInt(limit);
        if (!isNaN(parsedLimit)) {
            products = products.slice(0, parsedLimit);
        } else {
            return response.status(400).json({ error: 'Debe ser un numero valido' });
        }
    }

    response.json(products);
});

app.get('/products/:id', (request, response) => {
    const productId = parseInt(request.params.id);
    if (isNaN(productId)) {
        return response.status(400).json({ error: 'Debe ser un numero valido' });
    }

    const product = productManager.getProductById(productId);
    if (product) {
        response.json(product);
    } else {
        response.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Conectado al puerto ${port}`);
});
