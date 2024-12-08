//Script para la pantalla de inicio

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

    document.getElementById('jugarQuizButton').addEventListener('click', function() {
        window.location.href = 'juego.html';
    });

    document.getElementById('crearQuizButton').addEventListener('click', function() {
        window.location.href = 'crearQuiz.html';
    });
});