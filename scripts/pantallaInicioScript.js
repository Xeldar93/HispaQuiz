//Script para la pantalla de inicio

document.getElementById('jugarQuizButton').addEventListener('click', function() {
    // Lógica para el botón de jugarQuiz
    window.location.href = 'selectorQuiz.html';
    console.log('Botón de Jugar Quiz presionado');
});

document.getElementById('crearQuizButton').addEventListener('click', function() {
    // Lógica para el botón de crearQuiz
    window.location.href = 'crearQuiz.html';
    console.log('Botón de Crear Quiz presionado');
});