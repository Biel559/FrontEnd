require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
 
const express = require('express'); // Importa o Express
const mongoose = require('mongoose'); // Importa o Mongoose para conectar ao MongoDB
const cors = require('cors'); // Importa o middleware CORS
const jwt = require('jsonwebtoken'); // Para autenticação com JWT
 
const app = express(); // Inicializa uma aplicação Express
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const authorizeRoles = require('./middlewares/authorizeRoles'); // Middleware de roles
const authenticate = require('./middlewares/authenticate'); // Middleware de autenticação
 
// Middleware global para habilitar CORS e JSON
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://*.vercel.app', // Aceita qualquer subdomínio do Vercel
        process.env.FRONTEND_URL // URL do frontend em produção
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json()); // Middleware para processar requisições JSON

// Rota de autenticação
app.use('/api/auth', authRoutes);
 
// Rota protegida (exemplo)
app.get('/api/protected', authenticate, authorizeRoles('librarian'), (req, res) => {
    res.json({ message: "Bem-vindo ao dashboard" });
});
  
// Conecta ao banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));
 
// Inicializa o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));