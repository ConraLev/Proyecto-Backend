const express = require('express');
const productsRouter = require('./routers/products.Router');
const cartsRouter = require('./routers/carts.Router');
const viewsRouter = require('./routers/views.Router');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const app = express();
const ProductManager = require('../dao/FileSystem/ProductManager');
const productManager = new ProductManager();
const mongoose = require('mongoose');
const Message = require('../dao/models/messages.model');

const httpServer = app.listen(8080, () => {
    console.log(`Servidor escuchando en http://localhost:8080`);
});

const wsServer = new Server(httpServer);
app.set('ws', wsServer);

app.use(express.static(`${__dirname}/../public`));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/', viewsRouter);

mongoose.connect('mongodb+srv://ConraLev:admin-pass@ecommerce.ru9cifu.mongodb.net/', { dbName: 'ecommerce' })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

wsServer.on('connection', (clientSocket) => {
    console.log(`Cliente conectado ID: ${clientSocket.id}`);
    
        
    clientSocket.on('addProduct', async (receivedProduct) => {
        try {
            const { title, description, price, thumbnail, code, stock, category } = receivedProduct; 
                
            const newProductId = productManager.newId();
            await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
            const newProduct = productManager.getProductById(newProductId);
        
            wsServer.emit('updateProducts', newProduct);
        } catch (error) {
            console.error('Error al crear un nuevo producto:', error);
        }
    });

    clientSocket.on('deleteProduct', async (productId) => { 
        try {
            const id = parseInt(productId);
            await productManager.deleteProduct(id);
            wsServer.emit('productDeleted', id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });

    
    clientSocket.on('new-message', async (user, mensaje) =>{
        try{
            const nuevoMensaje = new Message({
                user: user,
                text: mensaje,
            })
            await nuevoMensaje.save();
            console.log(nuevoMensaje)
            
            
            wsServer.emit('mensaje',{ user, text: mensaje});
        } catch (error){
            console.error('Error al procesar el nuevo mensaje:', error);
        }
    })
    
    clientSocket.on('user-connected', (user) =>{
        clientSocket.broadcast.emit('user-joined', user)
    })
    
    
});