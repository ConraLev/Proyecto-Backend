const express = require('express');
const app = express();
const { Server } = require('socket.io');
const session = require('express-session');
const productsRouter = require('./routers/products.Router');
const cartsRouter = require('./routers/carts.Router');
const viewsRouter = require('./routers/views.Router');
const sessionsRouter = require('./routers/sessions.Router');
const handlebars = require('express-handlebars');
const ProductManager = require('../dao/FileSystem/ProductManager');
const productManager = new ProductManager();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const Message = require('../dao/models/messages.model');
const Products = require('../dao/models/products.model');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./sessions/mongoStorage');
const {dbName, mongoUrl} = require('./dbConfig');
const initilizeStrategy = require('./config/passport.config');
const initializeStrategyGit = require('./config/passport-github.config');
const passport = require('passport');
const config = require('./config');


const httpServer = app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${config.PORT}`    );
});


const wsServer = new Server(httpServer);

app.set('ws', wsServer);
app.use(express.static(`${__dirname}/../public`));

mongoose.connect(mongoUrl, { dbName })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);
    
    
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
    
app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/sessions', sessionsRouter);
    
app.use(session({
    store: MongoStore.create({
        mongoUrl,
        mongoOption:{
            useNewUrlParser: true,
            useUnifiedTopology: true},
            ttl: 1000,
            }), 
            secret: "123123asd",
            resave: false,
            saveUninitialized: false
        }));
        
        initilizeStrategy();
        initializeStrategyGit();
        app.use(passport.initialize());
        app.use(passport.session()); 
        
wsServer.on('connection', (clientSocket) => {
            console.log(`Cliente conectado ID: ${clientSocket.id}`);
            
            clientSocket.on('addProduct', async (receivedProduct) => {
                try {
                    const { title, description, price, thumbnail, code, stock, category } = receivedProduct;
                    const newProductId = await productManager.newId();
                    const newProduct = new Products({
                        id: newProductId,
                        title: title,
                        description: description,
                        price: price,
                        thumbnail: thumbnail,
                        code: code,
                        stock: stock,
                        category: category
                    });
            
                    await newProduct.save();
                    wsServer.emit('updateProducts', newProduct);
                } catch (error) {
                    console.error('Error al crear un nuevo producto:', error);
                }
            });
        
            
            clientSocket.on('deleteProduct', async (productId) => { 
                try {
                    const deletedProduct = await Products.findOneAndDelete({id: productId});
        
                    if (!deletedProduct) {
                        wsServer.emit('productDeleteError', `No se encontró el producto con ID ${productId}`);
                    } else {
                        wsServer.emit('productDeleted', productId);
                    }
                } catch (error) {
                    console.error('Error al eliminar el producto:', error);
                    wsServer.emit('productDeleteError', `Error al eliminar el producto: ${error.message}`);
                }
            });
            
            clientSocket.on('get-messages', async () => {
                try {
                    const messages = await Message.find().sort({ createdAt: 1 }); 
                    clientSocket.emit('load-messages', messages); 
                } catch (error) {
                    console.error('Error al obtener los mensajes:', error);
                }
            });
            
            clientSocket.on('new-message', async (user, mensaje) =>{
                try{
                    const nuevoMensaje = new Message({
                        user: user,
                        text: mensaje,
                    })
                    await nuevoMensaje.save();            
                    
                    wsServer.emit('mensaje',{ user, text: mensaje});
                } catch (error){
                    console.error('Error al procesar el nuevo mensaje:', error);
                }
            })
            
            clientSocket.on('user-connected', (user) =>{
                clientSocket.broadcast.emit('user-joined', user)
            })
            
        
            /*   FS.DeleteProduct = clientSocket.on('deleteProduct', async (productId) => { 
                   try {
                       const id = parseInt(productId);
                       await productManager.deleteProduct(id);
                       wsServer.emit('productDeleted', id);
                   } catch (error) {
                       console.error('Error al eliminar el producto:', error);
                   }
               }); */
            
    });

module.exports = app;