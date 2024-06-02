const socket = io();

socket.on('connect', () => {
    socket.emit('productsUpdated');
});

socket.on('updateProducts', (products) => {
    document.addEventListener('DOMContentLoaded', () => {

    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; 

    products.forEach(product => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('listaProductos');
        productoElement.innerHTML = `
            <h4>ID PRODUCTO: ${product._id}</h4>
            <h4>NOMBRE: ${product.title}</h4>
            <h4>DESCRIPCION: ${product.description}</h4>
            <h4>PRECIO: ${product.price}</h4>
            <h4>IMAGENES: ${product.thumbnails}</h4>
            <h4>CODIGO: ${product.code}</h4>
            <h4>STOCK: ${product.stock}</h4>
            <h4>CATEGORIA: ${product.category}</h4>
            <button class="add-to-cart-btn" data-product-id="${product._id}">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });


    const cartId = document.getElementById('cartId').value;
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn'); 

    console.log('Add to Cart Buttons:', addToCartButtons); 

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            console.log('Button clicked'); 
            const productId = event.target.getAttribute('data-product-id');

            try {
                const response = await fetch(`/carts/${cartId}/item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
            }
        });
    });

});
});

socket.on('productsUpdateError', (errorMessage) => {
    console.error('Error al obtener los productos:', errorMessage);
});

