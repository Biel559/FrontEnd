const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Inicialização do app
const app = express();

// Configuração do CORS
app.use(cors());

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
