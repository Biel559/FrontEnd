<template>
  <div class="book-list-container">
    <!-- Lista de livros -->
    <ul class="book-list">
      <!-- Itera sobre a lista de livros e gera um item de lista para cada livro -->
      <li v-for="book in books" :key="book._id" class="book-item">
        <!-- Exibe a imagem da capa do livro -->
        <img :src="book.image ? `http://localhost:3000${book.image}` : ''" alt="Capa do livro" v-if="book.image" />
        
        <!-- Exibe o título, autor, ano, ISBN e editora -->
        <div class="book-info">
          <span class="book-title">Título: {{ book.title }}</span>
          <span class="book-author">Autor: {{ book.author }}</span>
          <span class="book-year">Ano de lançamento: ({{ book.year }})</span>
          <span class="book-isbn">ISBN: {{ book.isbn }}</span>
          <span class="book-publisher">Editora: {{ book.publisher }}</span>
        </div>

        <!-- Botão para editar o livro, chama a função editBook com o livro como argumento -->
        <button @click="editBook(book)" class="edit-button">Editar</button>

        <!-- Botão para excluir o livro, chama a função deleteBook com o ID do livro -->
        <button @click="deleteBook(book._id)" class="delete-button">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<script>
// Importa o serviço API (Axios) para realizar requisições HTTP
import api from '../services/api';

export default {
  data() {
    return {
      books: [] // Estado local da lista de livros
    };
  },
  methods: {
    fetchBooks() { // Método para buscar os livros do back-end
      api.getBooks().then(response => {
        this.books = response.data; // Atualiza a lista de livros com a resposta da API
      });
    },
    deleteBook(id) { // Método para excluir um livro pelo ID
      api.deleteBook(id).then(() => {
        this.fetchBooks(); // Atualiza a lista de livros após a exclusão
      });
    },
    editBook(book) { // Método para editar um livro
      this.$emit('edit-book', book); // Emite um evento para o componente pai com o livro a ser editado
      console.log('Editando livro:', book); // Log para verificar se a função está sendo chamada corretamente
    }
  },
  mounted() {
    this.fetchBooks(); // Chama o método para buscar os livros ao montar o componente
  }
};
</script>

   
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');

span {
  font-family: 'Nunito', sans-serif;
}

.book-list-container {
  margin-top: 20px;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
  border: 3px solid #80cbc4;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #b2dfdb;
  transition: background-color 0.3s;
}

.book-item:hover {
  background-color: #a7ffeb;
}

.book-info {
  flex: 1;
  margin-left: 20px;
}

.book-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.book-author,
.book-year,
.book-isbn,
.book-publisher {
  display: block;
  font-size: 1rem;
  margin: 3px 0;
}

img{
  width: 120px;
  height: 180px;
  object-fit: cover;
  border: 3px solid #00796b;
  border-radius: 5px;
}

.book-image {
  max-width: 120px;
  max-height: 180px;
  object-fit: cover;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.edit-button, .delete-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  margin-left: 10px;
}

.edit-button {
  background-color: #00796b;
  color: white;
}

.edit-button:hover {
  background-color: #004d40;
  transform: scale(1.05);
}

.delete-button {
  background-color: #d32f2f;
  color: white;
}

.delete-button:hover {
  background-color: #b71c1c;
  transform: scale(1.05);
}
</style>  