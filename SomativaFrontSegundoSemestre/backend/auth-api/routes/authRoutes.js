const express = require('express'); // Importa o Express
const router = express.Router(); // Cria um roteador do Express
const axios = require('axios'); // Importa o Axios para fazer requisições HTTP
const User = require('../models/user'); // Modelo de usuário
const authController = require('../controllers/authController'); // Controlador de autenticação
const authenticate = require('../middlewares/authenticate'); // Middleware de autenticação
const mongoose = require('mongoose'); // Importa mongoose para trabalhar com ObjectId

// Route to register new users
router.post('/register', authController.register);

// Route to log in users
router.post('/login', authController.login);

// Route to reserve a book
router.post('/reserve', authenticate, async (req, res) => {
    const { id } = req.user; // Get the ID of the authenticated user
    const { bookId } = req.body; // ID of the book sent in the request body

    console.log(`[LOG] Starting reservation. Authenticated user: ${id}, Book: ${bookId}`);

    try {
        // Make a call to `library-backend` to get the book title
        const libraryBackendURL = process.env.LIBRARY_BACKEND_URL || 'http://localhost:3000';
        console.log(`[LOG] Requesting book from library-backend: ${libraryBackendURL}/api/books/${bookId}`);
        
        const bookResponse = await axios.get(`${libraryBackendURL}/api/books/${bookId}`);
        const book = bookResponse.data;

        console.log(`[LOG] Book found in library-backend:`, book);

        if (!book) {
            console.log(`[LOG] Book not found in stock.`);
            return res.status(404).json({ error: 'Book not found in stock.' });
        }

        // Look for the user in the auth-api
        console.log(`[LOG] Searching for user in the database by ID: ${id}`);
        const user = await User.findById(id);

        if (!user) {
            console.log(`[LOG] User not found.`);
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the user has already reserved 3 books
        console.log(`[LOG] User's current reservations:`, user.reservations);

        if (user.reservations.length >= user.reservationLimit) {
            console.log(`[LOG] User has reached the reservation limit (${user.reservationLimit}).`);
            return res.status(400).json({ error: 'You have reached the limit of reserved books.' });
        }

        // Add the book title to the user's reservations list
        user.reservations.push({ bookId: bookId, reservedAt: new Date() });
        await user.save();

        console.log(`[LOG] Reservation saved successfully. Updated reservations:`, user.reservations);

        // Return a success message and the list of reservations
        res.status(200).json({
            message: 'Book reserved successfully!',
            reservations: user.reservations
        });
    } catch (error) {
        console.error(`[ERROR] Error reserving book:`, error.message);

        if (error.response) {
            // Error from library-backend
            console.error(`[ERROR] Error details from library-backend:`, error.response.data);
            return res.status(error.response.status).json({
                error: 'Error fetching the book from library-backend.',
                details: error.response.data
            });
        }

        res.status(500).json({ error: 'Error reserving book.', details: error.message });
    }
});

router.patch('/users/:id/toggle-active', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ error: 'Error changing user status.', details: error.message });
    }
});

router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excludes the password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users.', details: error.message });
    }
});

router.delete('/users/:userId/reservations/:bookId', authenticate, async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        // Print the types of userId and bookId to check if they're coming correctly
        console.log('userId (type):', typeof userId, 'userId (value):', userId);
        console.log('bookId (type):', typeof bookId, 'bookId (value):', bookId);

        // Find the user in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Correctly convert the bookId to ObjectId using 'new'
        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Print the types to verify the conversion
        console.log('bookObjectId (type):', typeof bookObjectId, 'bookObjectId (value):', bookObjectId);

        // Find the index of the reservation we want to remove, considering ObjectId
        const reservationIndex = user.reservations.findIndex(reservation => {
            console.log('reservation.bookId (type):', typeof reservation.bookId, 'reservation.bookId (value):', reservation.bookId);
            return reservation.bookId.toString() === bookObjectId.toString(); // ObjectId comparison
        });

        // If the reservation is not found, return error
        if (reservationIndex === -1) {
            return res.status(404).json({ error: 'Reservation not found for the user.' });
        }

        // Remove the reservation from the array
        user.reservations.splice(reservationIndex, 1);

        // Save the changes to the database
        await user.save();

        // Return success with the updated list of reservations
        res.status(200).json({ message: 'Reservation removed successfully.', reservations: user.reservations });
    } catch (error) {
        res.status(500).json({ error: 'Error removing reservation.', details: error.message });
    }
});

// Route to update user information
router.put('/users/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, course, semester, matriculationId } = req.body; // Campos para atualizar

        // Encontrar o usuário
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Atualizar os dados do usuário
        if (username) user.username = username;
        if (course) user.course = course;
        if (semester) user.semester = semester;
        if (matriculationId) user.matriculationId = matriculationId;

        // Salvar as alterações
        await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user.', details: error.message });
    }
});

// Route to get a user by ID
router.get('/users/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;  // Pega o ID do usuário da URL

        // Busca o usuário pelo ID no banco de dados, excluindo o campo de senha
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Retorna o usuário encontrado
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user.', details: error.message });
    }
});

// Adiciona a rota para atualizar o reservationLimit de todos os usuários
router.patch('/users/update-reservation-limit', authenticate, async (req, res) => {
    try {
        // Verificar se o usuário autenticado é um 'librarian'
        const userRole = req.user.role; // Garantir que o 'role' esteja no objeto do usuário (assumindo que está)
        if (userRole !== 'librarian' && userRole !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only librarians or admins can modify the reservation limit.' });
        }

        const { newLimit } = req.body; // A nova quantidade de reservas que será aplicada a todos os usuários

        // Verifica se o newLimit foi passado na requisição
        if (newLimit === undefined) {
            return res.status(400).json({ error: 'Please provide a valid reservation limit.' });
        }

        // Atualiza o reservationLimit de todos os usuários
        const updatedUsers = await User.updateMany({}, { $set: { reservationLimit: newLimit } });

        res.status(200).json({ message: `${updatedUsers.nModified} users updated successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating reservation limits.', details: error.message });
    }
});
 
module.exports = router;