const quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;

function showScreen(screenId) {
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Generar campos dinámicos para las preguntas
document.getElementById('num-questions').addEventListener('input', function () {
    const numQuestions = parseInt(this.value);
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    for (let i = 0; i < numQuestions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');

        questionDiv.innerHTML = `
            <h3>Pregunta ${i + 1}</h3>
            <label>Texto de la Pregunta:</label>
            <input type="text" class="question-text" required>
            
            <label>Número de Opciones:</label>
            <input type="number" class="num-options" min="2" max="5" required>
            
            <label>Archivo (Imagen o Audio):</label>
            <input type="file" class="media-file" accept="image/*,audio/*" onchange="handleFileChange(event, ${i})">
            <div class="file-preview" id="file-preview-${i}"></div>
        `;

        container.appendChild(questionDiv);
    }
});

function handleFileChange(event, questionIndex) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById(`file-preview-${questionIndex}`);
    previewContainer.innerHTML = '';

    if (file) {
        const fileURL = URL.createObjectURL(file);
        let mediaPreview = '';

        if (file.type.startsWith('image/')) {
            mediaPreview = `<img src="${fileURL}" alt="Imagen cargada" style="max-width: 200px;">`;
        } else if (file.type.startsWith('audio/')) {
            mediaPreview = `<audio controls src="${fileURL}"></audio>`;
        }

        previewContainer.innerHTML = `
            ${mediaPreview}
            <button onclick="removeFile(${questionIndex})">Eliminar archivo</button>
        `;

        previewContainer.dataset.fileUrl = fileURL;
    }
}

function removeFile(questionIndex) {
    const fileInput = document.querySelectorAll('.media-file')[questionIndex];
    fileInput.value = ''; // Limpiar el input
    const previewContainer = document.getElementById(`file-preview-${questionIndex}`);
    previewContainer.innerHTML = ''; // Limpiar la vista previa
    delete previewContainer.dataset.fileUrl; // Eliminar el archivo asociado
}

// Crear el nuevo quiz y guardar la información
function createQuiz() {
    const title = document.getElementById('quiz-title').value;
    const numQuestions = parseInt(document.getElementById('num-questions').value);
    const hasTimer = document.getElementById('has-timer').checked;

    const questions = [];
    const questionBlocks = document.querySelectorAll('.question-block');

    questionBlocks.forEach((block, index) => {
        const questionText = block.querySelector('.question-text').value;
        const numOptions = parseInt(block.querySelector('.num-options').value);
        const options = [];
        for (let j = 0; j < numOptions; j++) {
            const optionText = prompt(`Opción ${j + 1} para la pregunta ${index + 1}`);
            options.push(optionText);
        }
        const correctAnswer = prompt(`¿Cuál es la respuesta correcta para la pregunta ${index + 1}?`);

        // Verificar si hay un archivo cargado
        const fileInput = block.querySelector('.media-file');
        const mediaURL = block.querySelector('.file-preview').dataset.fileUrl || null;

        questions.push({ questionText, options, correctAnswer, media: mediaURL });
    });

    const newQuiz = { title, questions, hasTimer };
    quizzes.push(newQuiz);
    alert("Quiz creado exitosamente");
    showScreen('start-screen');
    loadQuizzes();
}

// Cargar la lista de quizzes creados
function loadQuizzes() {
    const quizList = document.getElementById('quiz-list-items');
    quizList.innerHTML = '';
    quizzes.forEach((quiz, index) => {
        const li = document.createElement('li');
        li.textContent = quiz.title;
        li.onclick = () => playQuiz(index);
        quizList.appendChild(li);
    });
}

// Jugar un quiz con soporte para multimedia
function playQuiz(index) {
    currentQuiz = quizzes[index];
    currentQuestionIndex = 0;
    showScreen('play-quiz');
    loadQuestion();
}

// Mostrar una pregunta con multimedia (si aplica)
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const question = currentQuiz.questions[currentQuestionIndex];

    let mediaContent = '';
    if (question.media) {
        if (question.media.includes('audio')) {
            mediaContent = `<audio controls src="${question.media}"></audio>`;
        } else {
            mediaContent = `<img src="${question.media}" alt="Imagen de la pregunta" style="max-width:100%;">`;
        }
    }

    questionContainer.innerHTML = `
        <h3>${question.questionText}</h3>
        ${mediaContent}
        ${question.options.map((opt, i) => `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join('')}
    `;
}

loadQuizzes();
