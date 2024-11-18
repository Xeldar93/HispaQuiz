// Server.js con rutas especificadas

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect();

const secretKey = 'your_secret_key';

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(query, [username, email, hashedPassword], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send({ message: 'Usuario registrado exitosamente' });
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (results.length === 0) {
            return res.status(401).send({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        res.send({ message: 'Inicio de sesión exitoso', token });
    });
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
}

// Ruta para obtener los quizzes del usuario autenticado
app.get('/obtenerQuizzes', verifyToken, (req, res) => {
    const query = `
        SELECT q.id, q.title, q.hasTimer, q.timerMinutes, q.isShared,
               JSON_ARRAYAGG(JSON_OBJECT('questionText', qt.questionText, 'mediaUrl', qt.mediaUrl, 'correctAnswer', qt.correctAnswer, 'answers', (
                   SELECT JSON_ARRAYAGG(a.answerText) 
                   FROM answers a 
                   WHERE a.questionId = qt.id
               ))) AS questions
        FROM quizzes q
        LEFT JOIN questions qt ON q.id = qt.quizId
        WHERE q.userId = ? OR q.isShared = TRUE
        GROUP BY q.id
    `;
    connection.query(query, [req.userId], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});