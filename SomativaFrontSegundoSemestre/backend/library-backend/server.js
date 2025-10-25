const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

// Inicialização do app
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (como apps mobile ou Postman)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'https://front-end-three-dun.vercel.app',
      process.env.FRONTEND_URL
    ];
    
    // Verifica se a origem é do Vercel (aceita qualquer subdomínio)
    const isVercel = origin.includes('.vercel.app');
    
    if (allowedOrigins.indexOf(origin) !== -1 || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Responder explicitamente a requisições OPTIONS
app.options('*', cors());

// Para fazer o parsing do corpo das requisições em JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads' (para acessar as imagens via URL)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão ao MongoDB
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb+srv://biel559cr:gV0qyQD3WvOCWNmJ@clustergabriel559.b0eqt.mongodb.net/library",
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));