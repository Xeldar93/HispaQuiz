const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect(error => {
    if (error) throw error;
    console.log('Conectado a la base de datos.');
  });

  // Ruta para guardar un quiz
app.post('/guardarQuiz', (req, res) => {
    const quiz = req.body;

    // Guardar el quiz en la base de datos
    const quizQuery = 'INSERT INTO quizzes (title, hasTimer, timerMinutes) VALUES (?, ?, ?)';
    connection.query(quizQuery, [quiz.title, quiz.hasTimer, quiz.timerMinutes], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }

        const quizId = results.insertId;

        // Guardar las preguntas del quiz
        quiz.questions.forEach(question => {
            const questionQuery = 'INSERT INTO questions (quizId, questionText, mediaUrl, correctAnswer) VALUES (?, ?, ?, ?)';
            connection.query(questionQuery, [quizId, question.questionText, question.mediaUrl, question.correctAnswer], (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                }

                const questionId = results.insertId;

                // Guardar las respuestas de la pregunta
                question.answers.forEach((answer, index) => {
                    const answerQuery = 'INSERT INTO answers (questionId, answerText, isCorrect) VALUES (?, ?, ?)';
                    connection.query(answerQuery, [questionId, answer, index + 1 === question.correctAnswer], (error, results) => {
                        if (error) {
                            return res.status(500).send(error);
                        }
                    });
                });
            });
        });

        res.send({ message: 'Quiz guardado exitosamente' });
    });
});

// Ruta para obtener los quizzes disponibles
app.get('/obtenerQuizzes', (req, res) => {
    const query = 'SELECT * FROM quizzes';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(results);
    });
});

// Ruta para obtener los quizzes disponibles desde local storage
app.get('/obtenerQuizzes', (req, res) => {
    const query = `
        SELECT q.id, q.title, q.hasTimer, q.timerMinutes, 
               JSON_ARRAYAGG(JSON_OBJECT('questionText', qt.questionText, 'mediaUrl', qt.mediaUrl, 'correctAnswer', qt.correctAnswer, 'answers', (
                   SELECT JSON_ARRAYAGG(a.answerText) 
                   FROM answers a 
                   WHERE a.questionId = qt.id
               ))) AS questions
        FROM quizzes q
        LEFT JOIN questions qt ON q.id = qt.quizId
        GROUP BY q.id
    `;
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});