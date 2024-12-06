const express = require('express'); // Importa o Express
const router = express.Router(); // Cria um roteador do Express
const axios = require('axios'); // Importa o Axios para fazer requisições HTTP
const User = require('../models/user'); // Modelo de usuário
const authController = require('../controllers/authController'); // Controlador de autenticação
const authenticate = require('../middlewares/authenticate'); // Middleware de autenticação
const mongoose = require('mongoose'); // Importa mongoose para trabalhar com ObjectId

// Rota para registrar novos usuários
router.post('/register', authController.register);
 
// Rota para login de usuários
router.post('/login', authController.login); 
 
// Rota para reservar um livro
router.post('/reserve', authenticate, async (req, res) => {
    const { id } = req.user; // Obtém o ID do usuário autenticado
    const { bookId } = req.body; // ID do livro enviado no corpo da requisição

    console.log(`[LOG] Iniciando reserva. Usuário autenticado: ${id}, Livro: ${bookId}`);

    try {
        // Faz uma chamada ao `library-backend` para buscar o título do livro
        const libraryBackendURL = process.env.LIBRARY_BACKEND_URL || 'http://localhost:3000';
        console.log(`[LOG] Requisitando livro no library-backend: ${libraryBackendURL}/api/books/${bookId}`);
        
        const bookResponse = await axios.get(`${libraryBackendURL}/api/books/${bookId}`);
        const book = bookResponse.data;

        console.log(`[LOG] Livro encontrado no library-backend:`, book);

        if (!book) {
            console.log(`[LOG] Livro não encontrado no estoque.`);
            return res.status(404).json({ error: 'Livro não encontrado no estoque.' });
        }

        // Busca o usuário no auth-api
        console.log(`[LOG] Buscando usuário no banco de dados pelo ID: ${id}`);
        const user = await User.findById(id);

        if (!user) {
            console.log(`[LOG] Usuário não encontrado.`);
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Verifica se o usuário já reservou 3 livros
        console.log(`[LOG] Reservas atuais do usuário:`, user.reservations);

        if (user.reservations.length >= user.reservationLimit) {
            console.log(`[LOG] Usuário atingiu o limite de reservas (${user.reservationLimit}).`);
            return res.status(400).json({ error: 'Você já atingiu o limite de livros reservados.' });
        }

        // Adiciona o título do livro à lista de reservas do usuário
        user.reservations.push({ bookId: bookId, reservedAt: new Date() });
        await user.save();

        console.log(`[LOG] Reserva salva com sucesso. Reservas atualizadas:`, user.reservations);

        // Retorna uma mensagem de sucesso e a lista de reservas
        res.status(200).json({
            message: 'Livro reservado com sucesso!',
            reservations: user.reservations
        });
    } catch (error) {
        console.error(`[ERROR] Erro ao reservar livro:`, error.message);

        if (error.response) {
            // Erro vindo do library-backend
            console.error(`[ERROR] Detalhes do erro no library-backend:`, error.response.data);
            return res.status(error.response.status).json({
                error: 'Erro ao buscar o livro no library-backend.',
                details: error.response.data
            });
        }

        res.status(500).json({ error: 'Erro ao reservar livro.', details: error.message });
    }
});

router.patch('/users/:id/toggle-active', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso.`, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar estado do usuário.', details: error.message });
    }
});

router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclui o campo de senha
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
    }
});

router.delete('/users/:userId/reservations/:bookId', authenticate, async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        // Imprime o tipo de userId e bookId para verificar se estão chegando corretamente
        console.log('userId (type):', typeof userId, 'userId (value):', userId);
        console.log('bookId (type):', typeof bookId, 'bookId (value):', bookId);

        // Busca o usuário no banco de dados
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Converte o bookId para ObjectId corretamente com 'new'
        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Imprime os tipos de dados para verificar a conversão correta
        console.log('bookObjectId (type):', typeof bookObjectId, 'bookObjectId (value):', bookObjectId);

        // Encontra o índice da reserva que queremos remover, considerando o ObjectId
        const reservationIndex = user.reservations.findIndex(reservation => {
            console.log('reservation.bookId (type):', typeof reservation.bookId, 'reservation.bookId (value):', reservation.bookId);
            return reservation.bookId.toString() === bookObjectId.toString(); // Comparação de ObjectId
        });

        // Se a reserva não for encontrada, retornamos erro
        if (reservationIndex === -1) {
            return res.status(404).json({ error: 'Reserva não encontrada para o usuário.' });
        }

        // Remove a reserva do array
        user.reservations.splice(reservationIndex, 1);

        // Salva as alterações no banco de dados
        await user.save();

        // Retorna sucesso com a lista de reservas atualizada
        res.status(200).json({ message: 'Reserva removida com sucesso.', reservations: user.reservations });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover reserva.', details: error.message });
    }
});
 
module.exports = router;