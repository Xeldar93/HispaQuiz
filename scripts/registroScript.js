//Script para el registro de usuarios

document.getElementById('backButton').addEventListener('click', function() {
    // Lógica para el botón de crearQuiz
    window.location.href = 'pantallaInicio.html';
    console.log('Botón de volver a Inicio presionado');
});

document.getElementById('registerButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Usuario registrado:', data);
        window.location.href = 'login.html';
    })
    .catch(error => {
        console.error('Error al registrar usuario:', error);
    });
});