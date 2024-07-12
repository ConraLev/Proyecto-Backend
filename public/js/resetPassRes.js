document.getElementById('formResetPassword').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const token = document.getElementById('token').value;

    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('sessions/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.innerHTML = '<p>Contraseña restablecida con éxito.</p>';
        } else {
            if (response.status === 400 && result.error === 'La nueva contraseña debe ser diferente de la anterior') {
                messageDiv.innerHTML = `<p>Error: ${result.error}</p>`;
            } else {
                messageDiv.innerHTML = `<p>Error: ${result.error || 'No se pudo restablecer la contraseña.'}</p>`;
            }
        }
        } catch (error) {
            messageDiv.innerHTML = '<p>Error al enviar la solicitud. Por favor, intenta nuevamente.</p>';
        }
    });