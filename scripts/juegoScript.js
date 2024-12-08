// Script para el juego

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

document.addEventListener('DOMContentLoaded', function() {
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.style.display = 'none';
    questionContainer.appendChild(nextButton);

    // Recuperar los datos del quiz seleccionado desde localStorage
    const selectedQuiz = JSON.parse(localStorage.getItem('selectedQuiz'));
    const token = localStorage.getItem('token');

    let currentQuestionIndex = 0;
    let startTime;
    let changes = 0;

    if (selectedQuiz) {
        // Mostrar el título del quiz
        quizTitleDisplay.textContent = selectedQuiz.title;

        // Función para mostrar una pregunta
        function mostrarPregunta(index) {
            const question = selectedQuiz.questions[index];
            questionContainer.innerHTML = `
                <h3>Pregunta ${index + 1}: ${question.questionText}</h3>
                ${question.mediaUrl ? `<img src="${question.mediaUrl}" alt="Media de la pregunta">` : ''}
                <ul>
                    ${question.answers.map((answer, i) => `
                        <li>
                            <input type="radio" name="question-${index}" id="question-${index}-answer-${i}" value="${i}">
                            <label for="question-${index}-answer-${i}">${answer}</label>
                        </li>
                    `).join('')}
                </ul>
            `;
            questionContainer.appendChild(nextButton);
            nextButton.style.display = 'none';
            startTime = new Date().getTime();
            changes = 0;
        }

        // Mostrar la primera pregunta
        mostrarPregunta(currentQuestionIndex);

        // Manejar la selección de una respuesta
        questionContainer.addEventListener('change', function(event) {
            if (event.target.name === `question-${currentQuestionIndex}`) {
                nextButton.style.display = 'block';
                changes++;
            }
        });

        // Manejar el clic en el botón "Siguiente"
        nextButton.addEventListener('click', function() {
            const endTime = new Date().getTime();
            const timeTaken = (endTime - startTime) / 1000;

            const metric = {
                questionId: selectedQuiz.questions[currentQuestionIndex].id,
                timeTaken,
                changes
            };

            fetch('/guardarMetricas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ quizId: selectedQuiz.id, metrics: [metric] })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Métricas guardadas:', data);
            })
            .catch(error => {
                console.error('Error al guardar las métricas:', error);
            });

            currentQuestionIndex++;
            if (currentQuestionIndex < selectedQuiz.questions.length) {
                mostrarPregunta(currentQuestionIndex);
            } else {
                questionContainer.innerHTML = '<h3>¡Has completado el quiz!</h3>';
            }
        });
    } else {
        console.log('No se ha seleccionado ningún quiz.');
    }
});
});