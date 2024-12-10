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
    origin: '*', // Permite requisições apenas do seu frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // Adicione outros métodos se necessário
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Middleware para processar requisições JSON
// comentário
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
const PORT = process.env.PORT || 5000; // Use a porta atribuída pelo Render
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));