const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Inicialização do app
const app = express();

app.use(cors({
  origin: 'http://localhost:8080', // Substitua com a URL correta do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adicione os métodos que você está utilizando
}));

// Para fazer o parsing do corpo das requisições em JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads' (para acessar as imagens via URL)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão ao MongoDB
mongoose
  .connect(
    "mongodb+srv://biel559cr:gV0qyQD3WvOCWNmJ@clustergabriel559.b0eqt.mongodb.net/library",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Importação das rotas
const booksRoutes = require('./routes/book');

// Usar as rotas de livros com prefixo "/api/books"
app.use('/api/books', booksRoutes);

// Definir a porta do servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
