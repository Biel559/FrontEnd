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
        </div>
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
    console.log('Editando livro:', book);
  },
  },
  mounted() {
    this.fetchBooks();
  },
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