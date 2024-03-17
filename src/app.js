const express = require('express');
const productsRouter = require('./routers/products.Router');
const cartsRouter = require('./routers/carts.Router');
const viewsRouter = require('./routers/views.Router');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const app = express();
const port = 8080;
const products = [];
const fs = require('fs');
const { Console } = require('console');


app.use(express.static(`${__dirname}/../public`));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/', viewsRouter);


const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const wsServer = new Server(httpServer)
app.set('ws', wsServer);


wsServer.on('connection', (clientSocket) => {
    console.log(`Cliente conectado ID: ${clientSocket.id}`);
    clientSocket.emit('saludo', `Bienvenido ID: ${clientSocket.id}`);

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al leer los productos' });
        }
    });

  /*   clientSocket.on('addProduct', (newProduct) =>{
        console.log('ACA' + newProduct)
        productManager.addProduct(newProduct);
        console.log("ACA 2" + newProduct)

    }) */

    /* clientSocket.on('addProduct', (newProduct) => {
         fs.readFile('./products.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            const products = JSON.parse(data);
            products.push(newProduct);

            fs.writeFile('./products.json', JSON.stringify(products), (err) => {
                if (err) {
                    console.error(err);
                }
                wsServer.emit('updateProducts', products);
            });
        }); 
        console.log(newProduct)
    }); */


    /* router.post('/addProduct', (req, res) => {
    try {
        const wsServer = req.app.get('ws');
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const newProductId = productManager.newId(); 
        const newProduct = {
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        };
        productManager.addProduct(id, title, description, price, thumbnail, code, stock, category);
        wsServer.emit('addProduct', newProduct); 
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error);
        res.status(500).send('Error al agregar un nuevo producto');
    }
}); */

    clientSocket.on('new-message', (message) => {
        wsServer.emit('message', { id: clientSocket.id, text: message });
    });
});