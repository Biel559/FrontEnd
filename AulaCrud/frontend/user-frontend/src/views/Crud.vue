<template>
  <div id="app">
    <Navbar/>
    <div class="main-content">
      <div class="title-container">
        <h1 class="title">Add Books</h1>
        <img src="../assets/img/bookAdd.png" alt="E-Book Icon" class="title-icon" />
      </div>
    </div>
    <BookForm :bookToEdit="bookToEdit" @book-added="fetchBooks" @book-updated="fetchBooks" />
    <BookList :searchQuery="searchQuery" @edit-book="setBookToEdit" ref="bookList" />
  </div>
</template>

<script>
import BookList from '../components/BookList.vue';
import BookForm from '../components/BookForm.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  data() {
    return {
      bookToEdit: null,
      searchQuery: '', // Adiciona o estado para a consulta de pesquisa
    };
  },
  components: {
    BookList,
    BookForm,
    Navbar,
  },
  methods: {
    setBookToEdit(book) {
      this.bookToEdit = { ...book }; // Garante que o objeto seja passado por cópia
    },
    fetchBooks() {
      this.$refs.bookList.fetchBooks();
      this.bookToEdit = null;
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.app {
  background-color: #68B2F8;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Alinha o conteúdo horizontalmente no centro */
  gap: 40px;
  margin-bottom: 50px;
  margin-top: 12px;
}

.title {
  font-family: "Inika", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  width: 95px;
  height: 95px;
}

#app {
  padding-top: 100px;
}
</style>