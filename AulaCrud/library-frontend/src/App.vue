<template>
  <div id="app">
    <!-- Componente para o formulário de livros, passando o livro a ser editado e emitindo eventos -->
    <BookForm :bookToEdit="bookToEdit" @book-added="fetchBooks" @book-updated="fetchBooks" />
    
    <!-- Componente para listar os livros, emitindo um evento ao editar um livro -->
    <BookList @edit-book="setBookToEdit" ref="bookList" />
  </div>
</template>

<script>
// Importa os componentes BookList e BookForm
import BookList from './components/BookList.vue';
import BookForm from './components/BookForm.vue';

export default {
  data() {
    return {
      bookToEdit: null, // Estado do livro a ser editado (inicialmente nulo)
    };
  },
  components: {
    // Registra os componentes que serão usados no template
    BookList,
    BookForm,
  },
  methods: {
    setBookToEdit(book) {
      this.bookToEdit = book; // Define o livro a ser editado quando o evento é emitido
    },
    fetchBooks() {
      this.$refs.bookList.fetchBooks(); // Chama o método fetchBooks do componente BookList para atualizar a lista de livros
      this.bookToEdit = null; // Limpa o livro a ser editado após a ação
    },
  },
};
</script>
