require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const express = require('express'); // Importa o Express, um framework para criar APIs
const mongoose = require('mongoose'); // Importa o Mongoose para conectar e interagir com o MongoDB
const cors = require('cors'); // Importa o middleware CORS

const app = express(); // Inicializa uma aplicação Express
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação

app.use(cors({
    origin: 'http://localhost:8080', // Permite requisições apenas do seu frontend
    methods: ['GET', 'POST'], // Adicione outros métodos se necessário
}));

app.use(express.json()); // Middleware para processar requisições JSON

// Configura as rotas de autenticação para o caminho /api/auth
app.use('/api/auth', authRoutes);

// Conecta o banco de dados MongoDB usando a string de conexão armazenada em variáveis de ambiente
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Usa o novo parser de URL do MongoDB
    useUnifiedTopology: true, // Usa o novo mecanismo de gerenciamento de conexões
})
.then(() => console.log('Conectado ao MongoDB')) // Se conectar com sucesso, exibe mensagem no console
.catch((error) => console.error('Erro ao conectar ao MongoDB:', error)); // Se falhar, exibe mensagem de erro

const PORT = process.env.PORT || 5000; // Define a porta do servidor, usando variável de ambiente ou padrão 5000

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor e exibe mensagem no console
