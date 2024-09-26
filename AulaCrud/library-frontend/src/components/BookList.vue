<template>
     <div class="book-list-container">
          <!-- Lista de livros -->
           <ul class="book-list">
               <li v-for="book in books" :key="book._id" class="book-item">
                    <span>{{ book.title }} - {{ book.author }} ({{ book.year }})</span>
                    <button @click="editBook(book)" class="edit-button">Editar</button>
                    <button @click="deleteBook(book._id)" class="delete-button">Excluir</button>
               </li>
           </ul>
     </div>
</template>

<script>
import api from '../services/api'; // Importa o serviço API (Axios)

export default {
     data() {
          return { books: [] }; // Estado local da lista de livros
     },
     methods: {
          fetchBooks() { // Busca os livros do back-end
               api.getBooks().then(response =>{
                    this.books =  response.data; // Atualiza a lista de livros
               });
          },
          deleteBook(id) { // Exclui um livro pelo ID
               api.deleteBook(id).then(() => {
                    this.fetchBooks(); // Atualiza a lista após a exclusão
               });
          },
          editBook(book) {
               console.log('Editando livro:', book); // Verifique se está sendo chamado
               this.$emit('edit-book', book);
          },
     },
     mounted() {
          this.fetchBooks(); // Busca os livros ao montar o componente
     },
};
</script>