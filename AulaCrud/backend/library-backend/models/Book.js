const mongoose = require('mongoose');

// Definindo o esquema do livro
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  isbn: { type: String, required: true },
  image: { type: String }, // URL da imagem da capa
  publisher: { type: String }, // Editora
  synopsis: { type: String, default: null }, // Sinopse (não obrigatório)
  quantity: { type: Number, default: 0 }, // Quantidade em estoque
  genre: { type: String, required: true }, // Gênero literário
  rating: { type: Number, default: 0 }, // Nota média (começa com 0)
  ratings: {
    type: [
      {
        userId: { type: String, required: true }, // ID do usuário que avaliou
        rating: { type: Number, required: true } // Nota atribuída pelo usuário
      }
    ],
    default: [] // Inicia como um array vazio
  }
});

// Exportando o modelo
module.exports = mongoose.model('Book', BookSchema);
