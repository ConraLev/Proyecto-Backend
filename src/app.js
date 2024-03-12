
const express = require('express');
const productsRouter = require('./routers/products.Router');
const cartsRouter = require('./routers/carts.Router');
const viewsRouter = require('./routers/views.Router');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const app = express();
const port = 8080;

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

wsServer.on('connection', (clientSocket) =>{
    console.log(`Cliente conectado ID: ${clientSocket.id}`)
    clientSocket.emit('saludo', `Bienvenido ID: ${clientSocket.id}`)

    clientSocket.on('new-messege', (messege) =>{
        wsServer.emit('messege', { id: clientSocket.id, text: messege})
    })

    /* clientSocket.on('addProduct') */

})

