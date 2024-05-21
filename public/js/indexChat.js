const socket = io();

let user;

Swal.fire({
    title: 'Ingrese su Mail',
    text: 'Ingresa tu mail para indentificarte',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Debe escribir nombre para ingresar'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value; 
    socket.emit('user-connected', user)
});


document.addEventListener('DOMContentLoaded', () => {
    socket.emit('get-messages');
});

document.querySelector('#btnEnviar').addEventListener('click', () => {
    const mensaje = document.querySelector('#envMensaje').value;
    if (mensaje && mensaje.trim() !== '') { 
        socket.emit('new-message', user, mensaje);
        document.querySelector('#envMensaje').value = '';
    } else {
        console.error('El mensaje no puede estar vacío');
    }
});



socket.on('mensaje', (mensaje) => {
    const mensajeChat = document.createElement('p');
    mensajeChat.innerText = `${mensaje.user}: ${mensaje.text}`;
    document.querySelector('#chatBox').appendChild(mensajeChat);
});

socket.on('user-joined', (user) =>{
    Swal.fire({
        position: "top-center",
        text: `${user} se unió al chat`,
        showConfirmButton: false,
        timer: 1500
      });


});

socket.on('load-messages', (messages) => {
    messages.forEach(message => {
        const mensajeChat = document.createElement('p');
        mensajeChat.innerText = `${message.user}: ${message.text}`;
        document.querySelector('#chatBox').appendChild(mensajeChat);
    });
});