const quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;

function showScreen(screenId) {
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Función para guardar un nuevo quiz
function createQuiz() {
    const title = document.getElementById('quiz-title').value;
    const numQuestions = parseInt(document.getElementById('num-questions').value);
    const hasTimer = document.getElementById('has-timer').checked;

    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const questionText = prompt(`Pregunta ${i + 1}`);
        const numOptions = parseInt(prompt("¿Cuántas opciones?"));
        const options = [];
        for (let j = 0; j < numOptions; j++) {
            options.push(prompt(`Opción ${j + 1}`));
        }
        const correctAnswer = prompt("¿Cuál es la respuesta correcta?");
        questions.push({ questionText, options, correctAnswer });
    }

    const newQuiz = { title, questions, hasTimer };
    quizzes.push(newQuiz);
    alert("Quiz creado exitosamente");
    showScreen('start-screen');
    loadQuizzes();
}

// Función para cargar la lista de quizzes
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

// Función para jugar un quiz
function playQuiz(index) {
    currentQuiz = quizzes[index];
    currentQuestionIndex = 0;
    showScreen('play-quiz');
    loadQuestion();
}

// Cargar una pregunta
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const question = currentQuiz.questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <h3>${question.questionText}</h3>
        ${question.options.map((opt, i) => `<button onclick="checkAnswer('${opt}')">${opt}</button>`).join('')}
    `;
}

// Verificar la respuesta
function checkAnswer(answer) {
    const question = currentQuiz.questions[currentQuestionIndex];
    if (answer === question.correctAnswer) {
        alert("¡Correcto!");
    } else {
        alert("Incorrecto.");
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.questions.length) {
        loadQuestion();
    } else {
        alert("¡Quiz finalizado!");
        showScreen('quiz-list');
    }
}

// Cargar la lista de quizzes al inicio
loadQuizzes();
