document.addEventListener('DOMContentLoaded', () => {
    const cartIdElement = document.querySelector('#cartId');
    const cartId = cartIdElement ? cartIdElement.value : null;
    const addToCartButtons = document.querySelectorAll('.addToCard'); 

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            console.log('Button clicked'); 
            console.log(`El carrito es ${cartId}`);
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

