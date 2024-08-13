document.addEventListener('DOMContentLoaded', () => {
    const cartIdElement = document.getElementById('cartId');

    if (!cartIdElement) {
        console.error('cartId element not found');
        return;
    }

    const cartId = cartIdElement.value;

    async function updateCartView() {
        try {
            const response = await fetch(`/carts/${cartId}/json`);
            if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                const cart = await response.json();
                renderCart(cart);
            } else {
                const errorText = await response.text();
                console.error('Error al actualizar el carrito:', errorText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de actualización:', error);
        }
    }

    function renderCart(cart) {
        const cartContainer = document.getElementById('listaProductos');
        if (!cartContainer) {
            console.error('Cart container not found');
            return;
        }

        cartContainer.innerHTML = `
            <h2>Detalles del Carrito</h2>
            <div class="cart-items"></div>
            <h3>Total: ${calculateTotal(cart.products)}</h3>
            <button id="purchaseBtn" class="purchase-btn">Realizar Compra</button>
        `;

        const cartItemsContainer = cartContainer.querySelector('.cart-items');

        cart.products.forEach(product => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            itemElement.innerHTML = `
                <h4>ID PRODUCTO: </h4><p>${product.productId}</p>
                <h4>NOMBRE: </h4><p>${product.title}</p>
                <h4>PRECIO: </h4><p>${product.price}</p>
                <h4>CANTIDAD: </h4><p>${product.quantity}</p>
                <button class="remove-item-btn" data-product-id="${product.productId}">Eliminar</button>
            `;

            cartItemsContainer.appendChild(itemElement);
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.getAttribute('data-product-id');

                try {
                    const response = await fetch(`/carts/${cartId}/item/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'include'
                    });

                    if (response.ok) {
                        await updateCartView(); 
                    } else {
                        console.error('Error al eliminar el item:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error al realizar la solicitud:', error);
                }
            });
        });

        document.getElementById('purchaseBtn').addEventListener('click', async () => {
            try {
                const response = await fetch(`/carts/${cartId}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });
        
                if (response.ok) {
                    const result = await response.json();
                    console.log('Compra realizada con éxito:', result);
                    window.location.href = '/products';
                } else {
                    const errorText = await response.text(); 
                    console.error('Error al realizar la compra:', errorText);
                }
            } catch (error) {
                console.error('Error al realizar la solicitud de compra:', error);
            }
        });

    }

    function calculateTotal(products) {
        return products.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 0), 0);
    }

    updateCartView();
});


