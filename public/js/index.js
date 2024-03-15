document.addEventListener('DOMContentLoaded', () => {

    const socket = io();

    socket.on('saludo', (event) =>{
        console.log(event)
    });


    document.querySelector('#productForm').addEventListener('submit' , (e) =>{
        e.preventDefault();
        const form = document.querySelector('#productForm'); 
        const formData = new FormData(form);
        const newProduct = {};
        formData.forEach((value, key) => {
            if(key === 'thumbnails' && value.size === 0){
                newProduct['thumbnails'] = 'Sin Imagen';
            } else{
                newProduct[key] = value;
            }
        });
        socket.emit('addProduct', (newProduct))
        form.reset()
    })
    
    socket.on('updateProducts', (products) => { 
        const producto =  document.createElement('div');
        producto.innerText = `
        <h4>ID PRODUCTO: ${productos.id}</h4>
        <h4>NOMBRE: ${productos.title}</h4>
        <h4>DESCRIPCION: ${productos.description}</h4>
        <h4>PRECIO: ${productos.price}</h4>
        <h4>IMAGENES: ${productos.thumbnails}</h4>
        <h4>CODIGO: ${productos.code}</h4>
        <h4>STOCK: ${productos.stock}</h4>
        <h4>CATEGORIA: ${productos.category}</h4>
        `;
        document.querySelector('#productos').appendChild(producto);

        
    })

    
    document.querySelector('#btnEnviar').addEventListener('click', () =>{
        const messege = document.querySelector('#envMensaje').value;
        socket.emit('new-messege', (messege))
     })
    
    
    socket.on('messege', (messege) =>{
        const mensajeChat = document.createElement('p');
        mensajeChat.innerText = `${messege.id}: ${messege.text}`;
        document.querySelector('#chatBox').appendChild(mensajeChat)
    });



    
});    
