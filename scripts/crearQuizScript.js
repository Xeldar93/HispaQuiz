// Script para la creación de un quiz

document.getElementById('backButton').addEventListener('click', function() {
    // Lógica para el botón de crearQuiz
    window.location.href = 'pantallaInicio.html';
    console.log('Botón de volver a Inicio presionado');
});

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundAudio');
    audio.volume = 0.5; // Volumen más bajo para el resto del juego
    audio.play();
});

document.addEventListener('DOMContentLoaded', function() {
    const hasTimerCheckbox = document.getElementById('has-timer');
    const timerContainer = document.getElementById('timer-container');
    const numQuestionsInput = document.getElementById('num-questions');
    const questionsContainer = document.getElementById('questions-container');

    hasTimerCheckbox.addEventListener('change', function() {
        if (this.checked) {
            timerContainer.style.display = 'block';
        } else {
            timerContainer.style.display = 'none';
        }
    });

    numQuestionsInput.addEventListener('change', function() {
        const numQuestions = parseInt(this.value);
        questionsContainer.innerHTML = '';
        for (let i = 0; i < numQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            questionDiv.innerHTML = `
                <h3>Pregunta ${i + 1}</h3>
                <label for="question-${i}">Pregunta:</label>
                <input type="text" id="question-${i}" required>

                <label for="media-${i}">Media (URL o archivo):</label>
                <input type="text" id="media-${i}">
                <input type="file" id="media-file-${i}">

                <label for="answer-${i}-1">Respuesta 1:</label>
                <input type="text" id="answer-${i}-1" required>
                <label for="answer-${i}-2">Respuesta 2:</label>
                <input type="text" id="answer-${i}-2" required>
                <label for="answer-${i}-3">Respuesta 3:</label>
                <input type="text" id="answer-${i}-3" required>
                <label for="answer-${i}-4">Respuesta 4:</label>
                <input type="text" id="answer-${i}-4" required>

                <label for="correct-answer-${i}">Respuesta Correcta:</label>
                <select id="correct-answer-${i}">
                    <option value="1">Respuesta 1</option>
                    <option value="2">Respuesta 2</option>
                    <option value="3">Respuesta 3</option>
                    <option value="4">Respuesta 4</option>
                </select>
            `;

            questionsContainer.appendChild(questionDiv);
        }
    });

    document.getElementById('guardarQuiz').addEventListener('click', function() {
        const title = document.getElementById('quiz-title').value;
        const numQuestions = parseInt(document.getElementById('num-questions').value);
        const hasTimer = hasTimerCheckbox.checked;
        const timerMinutes = hasTimer ? parseInt(document.getElementById('timer-minutes').value) : null;

        const questions = [];
        for (let i = 0; i < numQuestions; i++) {
            const questionText = document.getElementById(`question-${i}`).value;
            const mediaUrl = document.getElementById(`media-${i}`).value;
            const mediaFile = document.getElementById(`media-file-${i}`).files[0];
            const answers = [
                document.getElementById(`answer-${i}-1`).value,
                document.getElementById(`answer-${i}-2`).value,
                document.getElementById(`answer-${i}-3`).value,
                document.getElementById(`answer-${i}-4`).value
            ];
            const correctAnswer = parseInt(document.getElementById(`correct-answer-${i}`).value);

            questions.push({
                questionText,
                mediaUrl,
                mediaFile,
                answers,
                correctAnswer
            });
        }

        const newQuiz = {
            title,
            numQuestions,
            hasTimer,
            timerMinutes,
            questions
        };

        console.log('Nuevo Quiz:', newQuiz);
        
        // logica para enviar el quiz a tu servidor en json
        fetch('/guardarQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuiz)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Quiz guardado:', data);
            // Redirigir o mostrar mensaje de éxito
        })
        .catch(error => {
            console.error('Error al guardar el quiz:', error);
        });
    });
});