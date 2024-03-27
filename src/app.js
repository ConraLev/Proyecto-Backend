const express = require('express');
const productsRouter = require('./routers/products.Router');
const cartsRouter = require('./routers/carts.Router');
const viewsRouter = require('./routers/views.Router');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const app = express();
const port = 8080;
const ProductManager = require(`${__dirname}/ProductManager`);
const productManager = new ProductManager();
const messageHistory = []


const httpServer = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const wsServer = new Server(httpServer);
app.set('ws', wsServer);


wsServer.on('connection', (clientSocket) => {
    console.log(`Cliente conectado ID: ${clientSocket.id}`);
    
    for(const data of messageHistory){
        clientSocket.emit('message', data)
    }
        
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

    clientSocket.on('new-message', (user, message) =>{
        try{
            wsServer.emit('message',{ user, text: message})
            messageHistory.push ({user, text: message})
        } catch (error){
            console.error('Error al procesar el nuevo mensaje:', error);
        }
    })

    clientSocket.on('user-connected', (user) =>{
        clientSocket.broadcast.emit('user-joined', user)
    })

    

});

app.use(express.static(`${__dirname}/../public`));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/', viewsRouter);
