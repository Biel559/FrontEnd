const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const { storage } = require('../config/cloudinary'); // Importa o storage do Cloudinary

// Configuração do Multer com Cloudinary
const upload = multer({
  storage: storage, // Usa o storage do Cloudinary
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos JPG, JPEG, PNG ou WEBP são permitidos!'), false);
    }
  },
}).single('image');

// *** CRIAÇÃO (POST) ***
router.post('/', upload, async (req, res) => {
  const { title, author, year, isbn, publisher, synopsis, genre, quantity } = req.body;
  const image = req.file ? req.file.path : ''; // Cloudinary retorna a URL completa em req.file.path

  try {
    const newBook = new Book({
      title,
      author,
      year,
      isbn,
      image, // Salva a URL do Cloudinary
      publisher,
      synopsis,
      genre,
      rating: 0,
      ratings: [],
      quantity: quantity || 0,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar livro', error });
  }
});

// *** LEITURA (GET) ***
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros', error });
  }
});

// *** ATUALIZAÇÃO (PUT) ***
router.put('/:id', upload, async (req, res) => {
  const { title, author, year, isbn, publisher, synopsis, genre, quantity } = req.body;
  const image = req.file ? req.file.path : undefined; // URL do Cloudinary

  const updatedData = {
    title,
    author,
    year,
    isbn,
    publisher,
    synopsis,
    genre,
    quantity: quantity !== undefined ? quantity : undefined,
  };

  if (image) updatedData.image = image;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar livro', error });
  }
});

// *** EXCLUSÃO (DELETE) ***
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.status(200).json({ message: 'Livro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar livro', error });
  }
});

// Rota para avaliar o livro
router.put('/:id/rate', authMiddleware, async (req, res) => {
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'A avaliação deve ser entre 0 e 5' });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    if (book.ratings.some(r => r.userId === req.userId)) {
      return res.status(400).json({ message: 'Você já avaliou este livro' });
    }

    book.ratings.push({ userId: req.userId, rating });

    const totalRating = book.ratings.reduce((acc, r) => acc + r.rating, 0);
    book.rating = totalRating / book.ratings.length;

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao avaliar livro', error });
  }
});

// Atualizar quantidade
router.put('/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  Book.findByIdAndUpdate(id, { quantity }, { new: true })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(500).json({ error: 'Failed to update quantity', err }));
});

// Rota para fornecer dados dos gráficos
router.get('/charts-data', async (req, res) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('title rating');

    const allBooks = await Book.find({}, 'genre');

    const genreCounts = {};

    allBooks.forEach((book) => {
      const genres = book.genre.split(',').map((g) => g.trim());
      genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const genres = Object.keys(genreCounts).map((key) => ({
      name: key,
      count: genreCounts[key],
    }));

    const topAuthors = await Book.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      topRatedBooks: topRatedBooks.map((book) => ({
        title: book.title,
        reviews: book.rating,
      })),
      genres,
      topAuthors,
    });
  } catch (error) {
    console.error("Erro ao buscar dados para os gráficos:", error);
    res.status(500).json({ message: 'Erro ao buscar dados para os gráficos', error });
  }
});

// Diminuir quantidade
router.put('/:id/decrease-quantity', async (req, res) => {
  const { id } = req.params;
  const { decreaseBy } = req.body;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    if (book.quantity < decreaseBy) {
      return res.status(400).json({ error: 'Quantidade insuficiente no estoque.' });
    }

    book.quantity -= decreaseBy;
    await book.save();

    res.status(200).json({ message: 'Quantidade reduzida com sucesso.', book });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao reduzir quantidade.', details: error.message });
  }
});

// Aumentar quantidade
router.put('/:id/increase-quantity', async (req, res) => {
  const { id } = req.params;
  const { increaseBy } = req.body;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    book.quantity += increaseBy;
    await book.save();

    res.status(200).json({ message: 'Quantidade aumentada com sucesso.', book });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aumentar quantidade.', details: error.message });
  }
});

// Obter detalhes de um livro específico
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar detalhes do livro', error });
  }
});

module.exports = router;