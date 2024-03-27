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

document.querySelector('#btnBorrar').addEventListener('click', (e) => {
    e.preventDefault();
    const productId = document.querySelector('#DelProductId').value;
    socket.emit('deleteProduct', productId);
    document.querySelector('#DelProductId').value = ''; 
});

socket.on('productDeleted', (id) =>  {
    const deletedProduct = document.getElementById('producto_' + id);
    if (deletedProduct) {
        deletedProduct.remove();
    } else {
        console.error('No se encontró el producto');
    }
});


    /* document.querySelector('#btnEnviar').addEventListener('click', () =>{
        const messege = document.querySelector('#envMensaje').value;
        socket.emit('new-messege', (messege))
     })
    
    
    socket.on('messege', (messege) =>{
        const mensajeChat = document.createElement('p');
        mensajeChat.innerText = `${messege.id}: ${messege.text}`;
        document.querySelector('#chatBox').appendChild(mensajeChat)
    }); */



    
  
