document.addEventListener('DOMContentLoaded', () => {
    const cartIdElement = document.querySelector('#cartId');
    const cartId = cartIdElement ? cartIdElement.value : null;
    const addToCartButtons = document.querySelectorAll('.addToCard');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');

            try {
                const response = await fetch(`/carts/${cartId}/item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });

                if (response.ok) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Producto agregado!',
                        text: 'El producto ha sido agregado al carrito.',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo agregar el producto al carrito.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la solicitud para agregar al carrito.',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    });

    document.getElementById('viewCartBtn').addEventListener('click', function() {
        var cartId = document.getElementById('cartId').value;
        if (cartId) {
            window.location.href = '/carts/' + cartId;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Carrito no encontrado',
                text: 'No se encontró el ID del carrito.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});
