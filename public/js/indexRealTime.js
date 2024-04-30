const socket = io();


document.querySelector('#productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#productForm');
    const formData = new FormData(form);
    const newProduct = {};
    formData.forEach((value, key) => {
        newProduct[key] = value;
    });
    socket.emit('addProduct', newProduct);
    form.reset();
});

document.querySelector('#btnBorrar').addEventListener('click', (e) => {
    e.preventDefault();
    const productId = document.querySelector('#DelProductId').value;
    socket.emit('deleteProduct', productId);
    document.querySelector('#DelProductId').value = ''; 
});



socket.on('updateProducts', (products) => {
    const producto = document.createElement('div');
    producto.innerText = `
    ID PRODUCTO: ${products.id}
    NOMBRE: ${products.title}
    DESCRIPCION: ${products.description}
    PRECIO: ${products.price}
    IMAGENES: ${products.thumbnails}
    CODIGO: ${products.code}
    STOCK: ${products.stock}
    CATEGORIA: ${products.category}
    `;
    document.querySelector('#productos').appendChild(producto);
});


socket.on('productDeleted', (id) =>  {
    const deletedProduct = document.getElementById('producto_' + id);
    if (deletedProduct) {
        deletedProduct.remove();
    } else {
        console.error('No se encontró el producto');
    }
});


socket.on('deleteProduct', async (productId) => { 
    try {
        const deletedProductId = await new Promise((resolve, reject) => {
            socket.emit('deleteProduct', productId, (deletedProductId) => {
                resolve(deletedProductId);
            });
        });
        
        if (!deletedProductId) {
            wsServer.emit('productDeleteError', `No se encontró el producto con ID ${productId}`);
        } else {
            wsServer.emit('productDeleted', deletedProductId);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        wsServer.emit('productDeleteError', `Error al eliminar el producto: ${error.message}`);
    }
});


    
  
