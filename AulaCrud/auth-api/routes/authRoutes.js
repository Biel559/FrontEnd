const express = require('express'); // Importa o Express
const router = express.Router(); // Cria um roteador do Express
const authController = require('../controllers/authController')

// Rota para registrar novos usuários
router.post('/register', authController.register);

// Rota para login de usuários
router.post('/login', authController.login);

module.exports = router; // Exporta o roteador para uso no app.js

//kh8qJTuHZug7LB9q
//mongodb+srv://<db_username>:<db_password>@clustergabriel559.b0eqt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterGabriel559