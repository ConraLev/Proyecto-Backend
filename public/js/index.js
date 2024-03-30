const socket = io();

socket.on('connect', () => {
    socket.emit('productsUpdated');
});

socket.on('updateProducts', (products) => {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; 

    products.forEach(product => {
        console.log(product)
        const productoElement = document.createElement('div');
        productoElement.classList.add('listaProductos');
        productoElement.innerHTML = `
            <h4>ID PRODUCTO: ${{id: id}}</h4>
            <h4>NOMBRE: ${{title: title}}</h4>
            <h4>DESCRIPCION: ${{description: description}}</h4>
            <h4>PRECIO: ${price}</h4>
            <h4>IMAGENES: ${thumbnails}</h4>
            <h4>CODIGO: ${code}</h4>
            <h4>STOCK: ${stock}</h4>
            <h4>CATEGORIA: ${category}</h4>
        `;
        productosContainer.appendChild(productoElement);
    });
});

socket.on('productsUpdateError', (errorMessage) => {
    console.error('Error al obtener los productos:', errorMessage);

});

/* socket.on('updateProducts', (products) => {
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
}); */