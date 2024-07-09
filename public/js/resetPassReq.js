document.getElementById('formReset').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/sessions/request-reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        
        if (response.ok) {
            messageDiv.innerHTML = '<p>Enlace de restablecimiento de contraseña enviado a tu correo electrónico.</p>';
        } else {
            messageDiv.innerHTML = `<p>Error: ${result.error || 'No se pudo enviar el correo de restablecimiento de contraseña.'}</p>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<p>Error al enviar la solicitud. Por favor, intenta nuevamente.</p>';
    }
});
