<template>
     <div class="book-list-container">
       <!-- Lista de livros -->
       <ul class="book-list">
         <!-- Itera sobre a lista de livros e gera um item de lista para cada livro -->
         <li v-for="book in books" :key="book._id" class="book-item">
           <!-- Exibe o título, autor e ano do livro -->
           <span>{{ book.title }} - {{ book.author }} ({{ book.year }})</span>
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
       },
     },
     mounted() {
       this.fetchBooks(); // Chama o método para buscar os livros ao montar o componente
     },
   };
   </script>
   
   <style scoped>
   /* Importa a fonte Nunito do Google Fonts */
   @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');
   
   /* Aplica a fonte Nunito ao elemento span */
   span {
     font-family: 'Nunito', sans-serif;
   }
   
   .book-list-container {
     margin-top: 20px; /* Margem superior para o container da lista */
   }
   
   .book-list {
     list-style: none; /* Remove os marcadores da lista */
     padding: 0; /* Remove o padding padrão */
   }
   
   .book-item {
     display: flex; /* Usa flexbox para alinhar os itens */
     justify-content: space-between; /* Espaça os itens igualmente */
     align-items: center; /* Alinha os itens verticalmente ao centro */
     padding: 15px; /* Padding interno do item da lista */
     border: 2px solid #090e0d; /* Borda do item da lista */
     border-radius: 5px; /* Bordas arredondadas */
     margin-bottom: 10px; /* Margem inferior entre os itens */
     background-color: #dae07d; /* Cor de fundo do item */
     transition: background-color 0.3s; /* Transição suave para a cor de fundo */
   }
   
   .book-item:hover {
     background-color: #a7ffeb; /* Muda a cor de fundo ao passar o mouse */
   }
   
   .book-info {
     font-family: 'Nunito', sans-serif; /* Aplica a fonte Nunito ao texto das informações do livro */
   }
   
   /* Estilos para os botões de editar e excluir */
   .edit-button, .delete-button {
     padding: 10px 15px; /* Padding interno dos botões */
     border: none; /* Remove a borda padrão */
     border-radius: 5px; /* Bordas arredondadas nos botões */
     cursor: pointer; /* Muda o cursor ao passar sobre os botões */
     font-weight: bold; /* Texto em negrito */
     transition: background-color 0.3s, transform 0.2s; /* Transições suaves para o fundo e transformações */
   }
   
   .edit-button {
     background-color: #00796b; /* Cor de fundo do botão de editar */
     color: white; /* Cor do texto do botão de editar */
   }
   
   .edit-button:hover {
     background-color: #004d40; /* Muda a cor ao passar o mouse */
     transform: scale(1.05); /* Aumenta levemente o botão ao passar o mouse */
   }
   
   .delete-button {
     background-color: #d32f2f; /* Cor de fundo do botão de excluir */
     color: white; /* Cor do texto do botão de excluir */
   }
   
   .delete-button:hover {
     background-color: #b71c1c; /* Muda a cor ao passar o mouse */
     transform: scale(1.05); /* Aumenta levemente o botão ao passar o mouse */
   }
   </style>
   