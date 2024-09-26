<template>
  <div class="app">
    <!-- Formulário para adicionar ou editar um livro -->
     <Book-Form :bookToEdit="bookToEdit" @book-added="fetchBooks" @book-updated="fetchBooks"/>
     <!-- Lista de livros -->
      <BookList @edit-book="setBookToEdit" ref="BookList" />
  </div>
</template>

<script>
import BookList from './BookList.vue';
import BookForm from './BookForm.vue';   


export default {
  data() {
    return {
      bookToEdit: null, // Inicialza o estado do livro a ser editado
    };
  },
  components: {
    BookList,
    BookForm,
  },
  methods: {
    // Função para definir o livro que será editado
    setBookToEdit(book){
      this.bookToEdit = book;
    },
    // Função para atualizar a lista de livros após adicionar ou editar
    fetchBooks() {
      this.$refs.bookList.fetchBooks();
      this.bookToEdit = ""; // Limpa o formulário após a ação
    },
  },
}
</script>