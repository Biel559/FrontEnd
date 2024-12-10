<template>
  <div class="bookform-container">
    <!-- Formulário de submissão do livro -->
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Campos para o título, autor, ano e ISBN do livro -->
      <input class="input-field" v-model="book.title" placeholder="Title" required />
      <input class="input-field" v-model="book.author" placeholder="Author" required />
      <input class="input-field" v-model="book.year" placeholder="Year" required />
      <input class="input-field" v-model="book.isbn" placeholder="ISBN" required />
      
      <!-- Entrada para selecionar a imagem da capa -->
      <div class="file-input-container">
        <input type="file" id="file-upload" @change="handleFileChange" />
        <label for="file-upload" class="file-upload-label">Choose Image</label>
        <!-- Notificação que a imagem foi escolhida -->
        <div v-if="imageChosen" class="image-chosen-message">Image chosen!</div>
      </div>

      <!-- Campos adicionais para o editor -->
      <input class="input-field" v-model="book.publisher" placeholder="Publisher" />
      <textarea class="input-field" v-model="book.synopsis" placeholder="Synopsis (optional)"></textarea>

      <!-- Campos para a quantidade e o gênero do livro -->
      <input class="input-field" v-model="book.quantity" type="number" placeholder="Quantity" min="0" required />
      <input class="input-field" v-model="book.genre" placeholder="Genre" required />

      <!-- Botão de envio do formulário -->
      <button class="submit-button" type="submit">
        {{ book._id ? 'Update Book' : 'Add Book' }}
      </button>
    </form>
  </div>
</template>

<script>
// Importa o serviço de API para comunicação com o backend
import api from '@/services/api';

export default {
  props: ['bookToEdit'], // Prop que recebe o livro a ser editado
  data() {
    return {
      // Objeto para armazenar os dados do livro
      book: {
        title: '',
        author: '',
        year: null,
        isbn: '',
        image: null,
        publisher: '',
        synopsis: '',
        quantity: null, // Adiciona o campo para quantidade
        genre: '', // Adiciona o campo para gênero
        _id: null,
      },
      selectedImage: null, // Variável para armazenar a imagem selecionada
      imageChosen: false, // Controle do estado de imagem escolhida
    };
  },
  watch: {
    // Observa as mudanças no objeto `bookToEdit` e atualiza o formulário
    bookToEdit: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.book = { ...newValue }; // Atualiza os dados do livro para edição
        } else {
          this.resetForm(); // Se não houver livro para editar, reseta o formulário
        }
      },
    },
  },
  methods: {
    // Função chamada quando o arquivo de imagem é alterado
    handleFileChange(event) {
      this.selectedImage = event.target.files[0]; // Armazena a imagem selecionada
      this.imageChosen = !!this.selectedImage; // Marca a imagem como escolhida se houver
    },
    // Função chamada quando o formulário é enviado
    handleSubmit() {
      const formData = new FormData();
      formData.append('title', this.book.title);
      formData.append('author', this.book.author);
      formData.append('year', this.book.year);
      formData.append('isbn', this.book.isbn);
      formData.append('publisher', this.book.publisher);
      formData.append('synopsis', this.book.synopsis);
      formData.append('quantity', this.book.quantity);  // Adiciona a quantidade
      formData.append('genre', this.book.genre);  // Adiciona o gênero

      // Se uma imagem foi selecionada, adiciona ao FormData
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      // Verifica se o livro tem um _id (para atualização) ou se é um novo livro
      if (this.book._id) {
        api.updateBook(this.book._id, formData).then(() => {
          this.$emit('book-updated'); // Emite evento após atualização
          this.resetForm(); // Reseta o formulário
        });
      } else {
        api.addBook(formData).then(() => {
          this.$emit('book-added'); // Emite evento após adicionar
          this.resetForm(); // Reseta o formulário
        });
      }
    },
    // Função para resetar os dados do formulário
    resetForm() {
      this.book = {
        title: '',
        author: '',
        year: null,
        isbn: '',
        image: null,
        publisher: '',
        synopsis: '',
        quantity: null,  // Reseta a quantidade
        genre: '',  // Reseta o gênero
        _id: null,
      };
      this.selectedImage = null; // Reseta a imagem selecionada
      this.imageChosen = false; // Reseta o estado de imagem escolhida
    },
  },
};
</script>

<style scoped>
/* Estilos para o formulário */
.bookform-container {
  margin-top: 50px;
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 9px solid #4e0a57;
  border-radius: 10px;
  background-color: #651F71;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilos para os campos de entrada */
.input-field {
  width: 94.5%;
  padding: 10px;
  margin: 10px 0;
  border: 5px solid #4e0a57;
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Nunito', sans-serif;
  transition: border-color 0.3s;
}

/* Foco nos campos de entrada */
.input-field:focus {
  border-color: #4e0a57;
  outline: none;
}

/* Estilo para o botão de submissão */
.submit-button {
  font-family: 'Nunito',serif;
  width: 100%;
  padding: 10px;
  background-color: #7a297d;
  color: white;
  border: 5px solid #4e0a57;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

/* Efeito de hover no botão de submissão */
.submit-button:hover {
  background-color: #4e0a57;
  transform: scale(1.05);
}

/* Estilos para o botão de upload de arquivo */
.file-input-container {
  position: relative;
  width: 94.5%;
  margin: 12px auto;
  margin-right: 30px;
}

#file-upload {
  display: none; /* Esconde o botão padrão */
}

/* Estilo para o rótulo do botão de upload */
.file-upload-label {
  font-family: 'Nunito', serif;
  display: inline-block;
  width: 100%;
  padding: 10px;
  background-color: #7a297d;
  color: white;
  text-align: center;
  border: 5px solid #4e0a57;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

/* Efeito de hover no rótulo do botão de upload */
.file-upload-label:hover {
  background-color: #4e0a57;
  transform: scale(1.05);
}

/* Estilo para o aviso de imagem escolhida */
.image-chosen-message {
  font-family: 'Nunito', serif;
  margin-top: 10px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
}
</style>
