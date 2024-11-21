<template>
  <div class="bookform-container">
    <!-- Formulário que evita o comportamento padrão de envio -->
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Campo de input para o título do livro -->
      <input class="input-field" v-model="book.title" placeholder="Título" required />
      
      <!-- Campo de input para o autor do livro -->
      <input class="input-field" v-model="book.author" placeholder="Autor" required />
      
      <!-- Campo de input para o ano do livro -->
      <input class="input-field" v-model="book.year" placeholder="Ano" required />
      
      <!-- Campo de input para o ISBN -->
      <input class="input-field" v-model="book.isbn" placeholder="ISBN" required />
      
      <!-- Campo de input para a URL da imagem da capa (agora será o upload da imagem) -->
      <input type="file" @change="handleFileChange" />
      
      <!-- Campo de input para a editora do livro -->
      <input class="input-field" v-model="book.publisher" placeholder="Editora" />
      
      <!-- Campo de input para a sinopse do livro -->
      <textarea class="input-field" v-model="book.synopsis" placeholder="Sinopse (opcional)"></textarea>
      
      <!-- Botão de envio que muda o texto dependendo se é atualização ou adição -->
      <button class="submit-button" type="submit">{{ book._id ? 'Atualizar' : 'Adicionar' }}</button>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  props: ['bookToEdit'],
  data() {
    return {
      book: this.bookToEdit || {
        title: '',
        author: '',
        year: null,
        isbn: '',
        image: null,
        publisher: '',
        synopsis: '',
      },
      selectedImage: null, // Guardar a imagem selecionada
    };
  },
  watch: {
    bookToEdit: {
      immediate: true,
      handler(newVal) {
        this.book = newVal || { title: '', author: '', year: null, isbn: '', image: null, publisher: '', synopsis: '' };
      },
    },
  },
  methods: {
    handleFileChange(event) {
      // Armazena o arquivo da imagem selecionada
      this.selectedImage = event.target.files[0];
    },
    handleSubmit() {
      console.log("Conteúdo de selectedImage:", this.selectedImage); // <-- ADICIONE AQUI
      const formData = new FormData();
      formData.append('title', this.book.title);
      formData.append('author', this.book.author);
      formData.append('year', this.book.year);
      formData.append('isbn', this.book.isbn);
      formData.append('publisher', this.book.publisher);
      formData.append('synopsis', this.book.synopsis);

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      console.log("Dados enviados:", Array.from(formData.entries()));

      if (this.book._id) {
        api.updateBook(this.book._id, formData).then(() => {
          this.$emit('book-updated');
          window.location.reload(); // Recarrega a página após a atualização
        });
      } else {
        api.addBook(formData).then(() => {
          this.$emit('book-added');
          window.location.reload(); // Recarrega a página após a adição
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
