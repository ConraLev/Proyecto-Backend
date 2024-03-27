const socket = io();

let user;
let chatBox = document.querySelector('chatBox')

Swal.fire({
    title: 'Ingrese su Alias',
    text: 'Ingresa tu usuario para indentificarte',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Debe escribir nombre para ingresar'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value; 
    socket.emit('user-connected', user)
});


/* Swal.fire({
    text: '${} se unio',
    toast: true,
    position: 'top-center'
});
 */

document.querySelector('#btnEnviar').addEventListener('click', () => {
    const message = document.querySelector('#envMensaje').value;
    socket.emit('new-message', user, message);
});


socket.on('message', (message) => {
    const mensajeChat = document.createElement('p');
    mensajeChat.innerText = `${message.user}: ${message.text}`;
    document.querySelector('#chatBox').appendChild(mensajeChat);
});

socket.on('user-joined', (user) =>{
    Swal.fire({
        position: "top-center",
        text: `${user} se unió al chat`,
        showConfirmButton: false,
        timer: 1500
      });



    /* Swal.fire({
    text: `${user} se unio`,
    toast: true,
    position: 'top-center' */
});
