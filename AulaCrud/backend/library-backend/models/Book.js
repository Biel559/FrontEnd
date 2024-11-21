const mongoose = require('mongoose');

// Definindo o esquema do livro
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  isbn: { type: String, required: true },  // ISBN é um campo obrigatório
  image: { type: String },  // URL da imagem da capa
  publisher: { type: String },  // Editora
  synopsis: { type: String, default: null },  // Sinopse (não obrigatório)
});

// Exportando o modelo
module.exports = mongoose.model('Book', BookSchema);
