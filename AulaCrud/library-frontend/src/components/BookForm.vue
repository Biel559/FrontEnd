<template>
  <div class="bookform-container">
    <form @submit.prevent="handleSubmit">
      <input v-model="book.title" placeholder="Título" required />
      <input v-model="book.author" placeholder="Autor" required />
      <input v-model="book.year" placeholder="Ano" required />
      <button type="submit">{{ book._id ? 'Atualizar' : 'Adicionar' }}</button>
    </form>
  </div>
</template>

<script>
import api from '@/services/api'; // Importa o serviço API para fazer requisições

export default {
  props: ['bookToEdit'], // Recebe o livro a ser editado como uma prop
  data() {
    return {
      book: this.bookToEdit || { title: '', author: '', year: null }, // Inicializa os dados do livro
    };
  },
  watch: {
    bookToEdit: {
      immediate: true,
      handler(newVal) {
        this.book = newVal || { title: '', author: '', year: null }; // Atualiza os dados quando a prop mudar
      },
    },
  },
  methods: {
    handleSubmit() {
      if (this.book._id) {
        api.updateBook(this.book._id, this.book).then(() => {
          this.$emit('book-updated'); // Emite um evento quando o livro é atualizado
        });
      } else {
        api.addBook(this.book).then(() => {
          this.$emit('book-added'); // Emite um evento quando um novo livro é adicionado
        });
      }
    },
  },
};
</script>

<style scoped>
.bookform-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid #80cbc4;
  border-radius: 10px;
  background-color: #b2dfdb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #00796b;
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Nunito', sans-serif; /* Usando a fonte Nunito */
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #004d40; /* Muda a cor da borda ao focar */
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #004d40; /* Muda a cor do botão ao passar o mouse */
  transform: scale(1.05); /* Aumenta levemente o botão ao passar o mouse */
}
</style>