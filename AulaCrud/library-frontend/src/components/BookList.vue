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
               this.$emit('edit-book', book);
               console.log('Editando livro:', book); // Verifique se está sendo chamado
          },
     },
     mounted() {
          this.fetchBooks(); // Busca os livros ao montar o componente
     },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');

span{
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
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 2px solid #090e0d;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #dae07d;
  transition: background-color 0.3s;
}

.book-item:hover {
  background-color: #a7ffeb;
}

.book-info {
  font-family: 'Nunito', sans-serif; /* Aplica a fonte Nunito */
}

.edit-button, .delete-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
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