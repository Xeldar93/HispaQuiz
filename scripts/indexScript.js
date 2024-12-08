// indexScript.js

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundAudio');
    const startButton = document.getElementById('startButton');
    const audioControlButton = document.getElementById('audioControlButton');
    const audioControlIcon = document.getElementById('audioControlIcon');

    startButton.addEventListener('click', function() {
        audio.volume = 1.0; // Volumen alto para el index
        audio.play().catch(error => {
            console.error('Error al reproducir el audio:', error);
        });

        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = 'gui/pantallaInicio.html';
        } else {
            window.location.href = 'gui/login.html';
        }
        console.log('Botón de inicio presionado');
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
});