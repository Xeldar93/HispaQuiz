document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundAudio');
    const audioControlButton = document.getElementById('audioControlButton');
    const audioControlIcon = document.getElementById('audioControlIcon');

    // Manejar el estado del audio
    let audioState = localStorage.getItem('audioState');
    if (!audioState) {
        audioState = 'playing';
        localStorage.setItem('audioState', 'playing');
    }

    if (audioState === 'paused') {
        audio.pause();
        audioControlIcon.textContent = 'volume_off';
    } else {
        audio.play().catch(error => {
            console.error('Error al reproducir el audio:', error);
        });
        audioControlIcon.textContent = 'volume_up';
    }

    audioControlButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error('Error al reproducir el audio:', error);
            });
            audioControlIcon.textContent = 'volume_up';
            localStorage.setItem('audioState', 'playing');
        } else {
            audio.pause();
            audioControlIcon.textContent = 'volume_off';
            localStorage.setItem('audioState', 'paused');
        }
    });
});