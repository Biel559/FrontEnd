<template>
  <div class="book-list-container">
    <!-- Lista de livros filtrados -->
    <ul class="book-list">
      <li v-for="book in filteredBooks" :key="book._id" class="book-item">
        <img :src="book.image ? `http://localhost:3000${book.image}` : ''" alt="Capa do livro" v-if="book.image" />
        <div class="book-info">
          <span class="book-title">Title: {{ book.title }}</span>
          <span class="book-author">Author: {{ book.author }}</span>
          <span class="book-year">Year: ({{ book.year }})</span>
          <span class="book-isbn">ISBN: {{ book.isbn }}</span>
          <span class="book-publisher">Publisher: {{ book.publisher }}</span>
          
          <!-- Exibe a quantidade -->
          <span class="book-quantity">Quantity: {{ book.quantity }}</span>

          <!-- Exibe o rating -->
          <span class="book-rating">Rating: {{ book.rating }}</span> <!-- Exibe o rating -->

          <!-- Exibe o gênero -->
          <span class="book-genre">Genre: {{ book.genre }}</span>
        </div>

        <!-- Botões para aumentar/diminuir a quantidade -->
        <button @click="updateQuantity(book, 'increase')" class="quantity-button increase-button">+</button>
        <button @click="updateQuantity(book, 'decrease')" class="quantity-button decrease-button">-</button>

        <!-- Botões de editar e excluir -->
        <button @click="editBook(book)" class="edit-button">Edit</button>
        <button @click="deleteBook(book._id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  props: {
    searchQuery: {
      type: String,
      default: '', // Recebe a consulta de pesquisa como uma propriedade
    },
  },
  data() {
    return {
      books: [],
    };
  },
  computed: {
    filteredBooks() {
      // Filtra os livros com base na consulta de pesquisa
      return this.books.filter((book) =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    fetchBooks() {
      api.getBooks().then((response) => {
        this.books = response.data;
      });
    },
    deleteBook(id) {
      api.deleteBook(id).then(() => {
        this.fetchBooks();
      });
    },
    editBook(book) {
      this.$emit('edit-book', book); // Emite o livro para o App.vue
    },
    updateQuantity(book, action) {
      let newQuantity = action === 'increase' ? book.quantity + 1 : book.quantity - 1;
      newQuantity = Math.max(newQuantity, 0); // Impede que a quantidade fique negativa

      // Atualiza a quantidade do livro no backend
      api.updateBookQuantity(book._id, { quantity: newQuantity }).then(() => {
        book.quantity = newQuantity; // Atualiza localmente
      });
    },
  },
  mounted() {
    this.fetchBooks();
  },
};

</script>

<style scoped>
/* Estilos para os botões de quantidade */
.quantity-button {
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  margin-left: 10px;
}

.increase-button {
  background-color: #4caf50;
  color: white;
}

.decrease-button {
  background-color: #f44336;
  color: white;
}

.quantity-button:hover {
  transform: scale(1.1);
}

/* Estilos gerais */
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
.book-publisher,
.book-quantity,
.book-genre,
.book-rating {
  display: block;
  font-size: 1rem;
  margin: 3px 0;
}

img {
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
