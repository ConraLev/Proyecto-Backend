const { Server } = require('socket.io');
const Products = require('../dao/models/products.model');
const Message = require('../dao/models/messages.model');
const ProductManager = require('../dao/FileSystem/ProductManager');
const productManager = new ProductManager();


const initializeWsServer = (httpServer) => {
    const wsServer = new Server(httpServer);

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
                const deletedProduct = await Products.findOneAndDelete({ id: productId });

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

        clientSocket.on('new-message', async (user, mensaje) => {
            try {
                const nuevoMensaje = new Message({
                    user: user,
                    text: mensaje,
                });
                await nuevoMensaje.save();

                wsServer.emit('mensaje', { user, text: mensaje });
            } catch (error) {
                console.error('Error al procesar el nuevo mensaje:', error);
            }
        });

        clientSocket.on('user-connected', (user) => {
            clientSocket.broadcast.emit('user-joined', user);
        });
    });

    return wsServer;
};

module.exports = initializeWsServer;


