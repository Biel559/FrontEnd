const express = require('express'); // Importamos o Express
const Book = require('../models/Book'); // Importamos o modelo Book
const router = express.Router(); // Criamos o roteador
const multer = require('multer'); // Importa o Multer
const path = require('path'); // Para lidar com extensões de arquivos
const fs = require('fs'); // Para verificar e criar diretórios
const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware

// Verificar e criar o diretório 'uploads' se não existir
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuração do Multer para upload de imagens
const upload = multer({
  dest: uploadsDir, // Diretório onde as imagens serão salvas localmente
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, true); // Aceita o arquivo
    } else {
      cb(new Error('Apenas arquivos JPG, JPEG ou PNG são permitidos!'), false);
    }
  },
}).single('image'); // 'image' é o campo que usaremos para a imagem

// Configurar o Express para servir arquivos estáticos do diretório uploads
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// *** CRIAÇÃO (POST) ***
router.post('/', upload, async (req, res) => {
  const { title, author, year, isbn, publisher, synopsis, genre, quantity } = req.body; // Adicionando o campo quantity
  const image = req.file ? `/uploads/${req.file.filename}` : ''; // Caminho acessível pela URL

  try {
    const newBook = new Book({
      title,
      author,
      year,
      isbn,
      image, // Salva o caminho da imagem como URL
      publisher,
      synopsis,
      genre, // Adiciona o gênero literário
      rating: 0, // Inicializa a nota como 0
      ratings: [], // Inicializa o array de avaliações vazio
      quantity: quantity || 0, // Adiciona a quantidade, ou 0 caso não seja fornecida
    });

    await newBook.save();
    res.status(201).json(newBook); // Retorna o livro criado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar livro', error });
  }
});


// *** LEITURA (GET) ***
router.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // Buscamos todos os livros
    res.status(200).json(books); // Retornamos a lista de livros
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros', error });
  }
});

// *** ATUALIZAÇÃO (PUT) ***
router.put('/:id', upload, async (req, res) => {
  const { title, author, year, isbn, publisher, synopsis, genre, quantity } = req.body; // Extraímos os novos dados
  const image = req.file ? `/uploads/${req.file.filename}` : undefined; // Atualiza apenas se houver nova imagem

  const updatedData = { 
    title,
    author,
    year,
    isbn,
    publisher,
    synopsis,
    genre, // Adiciona o gênero literário
    quantity: quantity !== undefined ? quantity : undefined, // Atualiza a quantidade, se fornecida
    rating: undefined, // Não atualiza a nota diretamente (será atualizada nas avaliações)
    ratings: undefined // Não atualiza o array de avaliações diretamente
  };

  if (image) updatedData.image = image; // Se houver uma nova imagem, ela é atualizada

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } // Retorna o livro atualizado
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' }); // Se o livro não for encontrado
    }

    res.status(200).json(updatedBook); // Retornamos o livro atualizado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar livro', error });
  }
});


// *** EXCLUSÃO (DELETE) ***
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id); // Deletamos o livro pelo ID
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' }); // Se o livro não for encontrado
    }
    res.status(200).json({ message: 'Livro deletado com sucesso' }); // Retornamos mensagem de sucesso
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

// Exemplo no seu controller
router.put('/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  // Atualiza a quantidade do livro
  Book.findByIdAndUpdate(id, { quantity }, { new: true })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(500).json({ error: 'Failed to update quantity', err }));
});

// Rota para fornecer dados dos gráficos
router.get('/charts-data', async (req, res) => {
  try {
    // **Top 5 livros mais bem avaliados**
    const topRatedBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('title rating');

    // **Quantidade de livros por gênero (correção para separar os gêneros)**
    const allBooks = await Book.find({}, 'genre'); // Busca apenas o campo `genre`

    const genreCounts = {};

    allBooks.forEach((book) => {
      const genres = book.genre.split(',').map((g) => g.trim()); // Separa e remove espaços
      genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1; // Incrementa o contador
      });
    });

    const genres = Object.keys(genreCounts).map((key) => ({
      name: key,
      count: genreCounts[key],
    }));

    // **Top 5 autores com mais livros**
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

// Exportamos o roteador para ser usado no server.js
module.exports = router;
