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
        <button class="add-to-cart-btn" /* data-product-id="<%= product._id %>" */> Agregar al carrito </button>`
        productosContainer.appendChild(productoElement);
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const cartId = 'your_cart_id_here'; // You should have a way to get the current user's cart ID.
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

socket.on('productsUpdateError', (errorMessage) => {
    console.error('Error al obtener los productos:', errorMessage);

});

/* document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.productId;
            try {
                const response = await fetch(`/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
            }
        });
    });
} */






