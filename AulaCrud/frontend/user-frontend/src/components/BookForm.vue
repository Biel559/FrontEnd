<template>
  <div class="bookform-container">
    <!-- Formulário que evita o comportamento padrão de envio -->
    <form @submit.prevent="handleSubmit">
      <!-- Campo de input para o título do livro -->
      <input class="input-field" v-model="book.title" placeholder="Título" required />
      <!-- Campo de input para o autor do livro -->
      <input class="input-field" v-model="book.author" placeholder="Autor" required />
      <!-- Campo de input para o ano do livro -->
      <input class="input-field" v-model="book.year" placeholder="Ano" required />
      <!-- Botão de envio que muda o texto dependendo se é atualização ou adição -->
      <button class="submit-button" type="submit">{{ book._id ? 'Atualizar' : 'Adicionar' }}</button>
    </form>
  </div>
</template>

<script>
// Importa o serviço API para fazer requisições
import api from '@/services/api'; 

export default {
  // Recebe o livro a ser editado como uma prop
  props: ['bookToEdit'], 
  data() {
    return {
      // Inicializa os dados do livro, utilizando o valor da prop ou um objeto vazio
      book: this.bookToEdit || { title: '', author: '', year: null }, 
    };
  },
  watch: {
    // Observa mudanças na prop bookToEdit
    bookToEdit: {
      immediate: true, // Executa a função imediatamente na inicialização
      handler(newVal) {
        // Atualiza os dados do livro quando a prop mudar
        this.book = newVal || { title: '', author: '', year: null }; 
      },
    },
  },
  methods: {
    handleSubmit() {
      // Verifica se o livro já tem um ID, indicando que é uma atualização
      if (this.book._id) {
        api.updateBook(this.book._id, this.book).then(() => {
          // Emite um evento quando o livro é atualizado
          this.$emit('book-updated'); 
        });
      } else {
        // Se não tem ID, é uma adição de novo livro
        api.addBook(this.book).then(() => {
          // Emite um evento quando um novo livro é adicionado
          this.$emit('book-added'); 
        });
      }
    },
  },
};
</script>

<style scoped>
.bookform-container {
  max-width: 400px; /* Largura máxima do container */
  margin: 20px auto; /* Centraliza o container com margem vertical */
  padding: 20px; /* Padding interno */
  border: 2px solid #80cbc4; /* Borda com cor específica */
  border-radius: 10px; /* Bordas arredondadas */
  background-color: #b2dfdb; /* Cor de fundo do container */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra do container */
}

.input-field {
  width: 94.5%; /* Largura do campo de input */
  padding: 10px; /* Padding interno do input */
  margin: 10px 0; /* Margem vertical entre os inputs */
  border: 1px solid #00796b; /* Borda do input */
  border-radius: 5px; /* Bordas arredondadas no input */
  font-size: 16px; /* Tamanho da fonte do input */
  font-family: 'Nunito', sans-serif; /* Fonte utilizada */
  transition: border-color 0.3s; /* Transição suave para a cor da borda */
}

.input-field:focus {
  border-color: #004d40; /* Muda a cor da borda ao focar */
  outline: none; /* Remove o contorno padrão */
}

.submit-button {
  width: 100%; /* Largura total do botão */
  padding: 10px; /* Padding interno do botão */
  background-color: #00796b; /* Cor de fundo do botão */
  color: white; /* Cor do texto do botão */
  border: none; /* Remove a borda padrão */
  border-radius: 5px; /* Bordas arredondadas no botão */
  font-size: 16px; /* Tamanho da fonte do botão */
  font-weight: bold; /* Negrito no texto do botão */
  cursor: pointer; /* Muda o cursor ao passar sobre o botão */
  transition: background-color 0.3s, transform 0.2s; /* Transições suaves */
}

.submit-button:hover {
  background-color: #004d40; /* Muda a cor do botão ao passar o mouse */
  transform: scale(1.05); /* Aumenta levemente o botão ao passar o mouse */
}
</style>
