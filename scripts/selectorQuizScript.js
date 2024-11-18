// Script para el selector de quiz

document.getElementById('backButton').addEventListener('click', function() {
    // Lógica para el botón de crearQuiz
    window.location.href = 'pantallaInicio.html';
    console.log('Botón de volver a Inicio presionado');
});

document.addEventListener('DOMContentLoaded', function() {
    const listaQuizItems = document.getElementById('listaQuizItems');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Función para obtener los quizzes desde el servidor
    function obtenerQuizzes() {
        fetch('/obtenerQuizzes', {
            headers: {
                'x-access-token': token
            }
        })
        .then(response => response.json())
        .then(quizzes => {
            mostrarQuizzes(quizzes);
        })
        .catch(error => {
            console.error('Error al obtener los quizzes:', error);
        });
    }

    // Función para mostrar los quizzes en la lista
    function mostrarQuizzes(quizzes) {
        quizzes.forEach(quiz => {
            const li = document.createElement('li');
            li.textContent = quiz.title;
            li.addEventListener('click', function() {
                localStorage.setItem('selectedQuiz', JSON.stringify(quiz));
                window.location.href = 'juego.html';
            });
            listaQuizItems.appendChild(li);
        });
    }

    // Obtener los quizzes al cargar la página
    obtenerQuizzes();
});