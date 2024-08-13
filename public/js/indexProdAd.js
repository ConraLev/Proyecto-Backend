// const socket = io();


// document.querySelector('#productForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const form = document.querySelector('#productForm');
//     const formData = new FormData(form);
//     const newProduct = {};
//     formData.forEach((value, key) => {
//         newProduct[key] = value;
//     });
//     socket.emit('addProduct', newProduct);
//     form.reset();
// });

// document.querySelector('#btnBorrar').addEventListener('click', (e) => {
//     e.preventDefault();
//     const productId = document.querySelector('#DelProductId').value;
//     socket.emit('deleteProduct', productId);
//     document.querySelector('#DelProductId').value = ''; 
// });



// socket.on('updateProducts', (products) => {
//     const producto = document.createElement('div');
//     producto.innerText = `
//     ID PRODUCTO: ${products.id}
//     NOMBRE: ${products.title}
//     DESCRIPCION: ${products.description}
//     PRECIO: ${products.price}
//     IMAGENES: ${products.thumbnails}
//     CODIGO: ${products.code}
//     STOCK: ${products.stock}
//     CATEGORIA: ${products.category}
//     `;
//     document.querySelector('#productos').appendChild(producto);
// });


// socket.on('productDeleted', (id) =>  {
//     const deletedProduct = document.getElementById('producto_' + id);
//     if (deletedProduct) {
//         deletedProduct.remove();
//     } else {
//         console.error('No se encontró el producto');
//     }
// });


// socket.on('deleteProduct', async (productId) => { 
//     try {
//         const deletedProductId = await new Promise((resolve, reject) => {
//             socket.emit('deleteProduct', productId, (deletedProductId) => {
//                 resolve(deletedProductId);
//             });
//         });
        
//         if (!deletedProductId) {
//             wsServer.emit('productDeleteError', `No se encontró el producto con ID ${productId}`);
//         } else {
//             wsServer.emit('productDeleted', deletedProductId);
//         }
//     } catch (error) {
//         console.error('Error al eliminar el producto:', error);
//         wsServer.emit('productDeleteError', `Error al eliminar el producto: ${error.message}`);
//     }
// });


document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    const newProduct = {};
    formData.forEach((value, key) => {
        newProduct[key] = value;
    });

    try {
        const response = await fetch('/products/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Producto agregado exitosamente');
            loadProducts();  
        } else {
            alert(`Error al agregar el producto: ${result.error || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto');
    }

    form.reset();
});

document.getElementById('btnBorrar').addEventListener('click', async function(event) {
    event.preventDefault();
    const productId = document.getElementById('DelProductId').value;

    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Producto con ID ${productId} eliminado exitosamente`);
            loadProducts(); 
        } else {
            alert(`Error al eliminar el producto: ${result.error || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto');
    }

    document.getElementById('DelProductId').value = ''; 
});

async function loadProducts() {
    try {
        const response = await fetch('/products/admin');
        const products = await response.json();

        const productsContainer = document.getElementById('productos');
        productsContainer.innerHTML = '';

        products.forEach(product => {
            const producto = document.createElement('div');
            producto.id = `producto_${product.id}`;
            producto.innerHTML = `
                <p>ID PRODUCTO: ${product.id}</p>
                <p>NOMBRE: ${product.title}</p>
                <p>DESCRIPCION: ${product.description}</p>
                <p>PRECIO: ${product.price}</p>
                <p>IMAGEN: ${product.thumbnail}</p>
                <p>CODIGO: ${product.code}</p>
                <p>STOCK: ${product.stock}</p>
                <p>CATEGORIA: ${product.category}</p>
            `;
            productsContainer.appendChild(producto);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

loadProducts();



    
  
