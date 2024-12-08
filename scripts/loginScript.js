//script para la pantalla de login

document.getElementById('backButton').addEventListener('click', function() {
    // Lógica para el botón de crearQuiz
    window.location.href = 'pantallaInicio.html';
    console.log('Botón de volver a Inicio presionado');
});

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundAudio');
    const audioControlButton = document.getElementById('audioControlButton');
    const audioControlIcon = document.getElementById('audioControlIcon');

    audio.volume = 0.5; // Volumen más bajo para el resto del juego
    audio.play().catch(error => {
        console.error('Error al reproducir el audio:', error);
    });

    audioControlButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error('Error al reproducir el audio:', error);
            });
            audioControlIcon.textContent = 'volume_up';
        } else {
            audio.pause();
            audioControlIcon.textContent = 'volume_off';
        }
    });

document.getElementById('loginButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'pantallaInicio.html';
        } else {
            console.error('Error al iniciar sesión:', data.message);
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión:', error);
    });
});
});