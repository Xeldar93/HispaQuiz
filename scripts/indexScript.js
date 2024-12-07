// Script para el index

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundAudio');
    audio.volume = 1.0; // Volumen alto para el index
    audio.play();
});

document.getElementById('startButton').addEventListener('click', function() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'gui/pantallaInicio.html';
    } else {
        window.location.href = 'gui/login.html';
    }
    console.log('Botón de inicio presionado');
});