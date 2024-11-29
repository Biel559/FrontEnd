const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Inicialização do app
const app = express();

// Configuração do CORS
app.use(cors());
 
// Para fazer o parsing do corpo das requisições em JSON
app.use(express.json());

// Configuração do Multer para upload de imagens
const upload = multer({
  dest: 'uploads/', // Diretório onde as imagens serão salvas localmente
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, true); // Aceita o arquivo
    } else {
      cb(new Error('Apenas arquivos JPG, JPEG ou PNG são permitidos!'), false);
    }
  },
}).single('image'); // Espera um campo chamado "image"

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

// Criar um endpoint para upload de livro (com imagem)
app.post('/api/books', upload, async (req, res) => {
  try {
    // Verificando se a imagem foi recebida
    if (!req.file) {
      return res.status(400).json({ message: 'Imagem é obrigatória!' });
    }

    const { title, author, year, isbn, publisher, synopsis } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ''; // Caminho relativo da imagem

    // Criar o objeto do livro
    const newBook = new Book({
      title,
      author,
      year,
      isbn,
      image, // Salva o caminho da imagem
      publisher,
      synopsis,
    });

    // Salvar o livro no banco de dados
    await newBook.save();
    res.status(201).json(newBook); // Retorna o livro criado

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar livro', error });
  }
});

// Definir a porta do servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
