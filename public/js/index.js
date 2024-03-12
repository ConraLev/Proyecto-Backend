const socket = io();


function submitForm(){
    event.preventDefault();
    const form = document.querySelector('productForm');
    const formData = new FormData(form);
    const productData = {};
    formData.forEach((value, key)=>{
        productData[key] = value
    })
    console.log('Datos del producto:', productData);
}


socket.on('saludo', (event) =>{
    console.log(event)
} )


document.querySelector('#btnEnviar').addEventListener('click', () =>{
    const messege = document.querySelector('#envMensaje').value;
    socket.emit('new-messege', (messege))
})

socket.on('messege', (messege) =>{
    const mensajeChat = document.createElement('p');
    mensajeChat.innerText = `${messege.id}: ${messege.text}`;
    document.querySelector('#chatBox').appendChild(mensajeChat)
});




/* document.querySelector('#formProduct').addEventListener('click' , () =>{
    const newProduct = document.querySelectorAll(for)
}) */

/* socket.on('addProduct', (newProduct)  =>{

    

} ) */