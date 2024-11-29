<template>
  <div class="bookform-container">
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Campos do formulário -->
      <input class="input-field" v-model="book.title" placeholder="Título" required />
      <input class="input-field" v-model="book.author" placeholder="Autor" required />
      <input class="input-field" v-model="book.year" placeholder="Ano" required />
      <input class="input-field" v-model="book.isbn" placeholder="ISBN" required />
      
      <!-- Campo de input para a URL da imagem da capa (agora será o upload da imagem) -->
      <div class="file-input-container">
        <input type="file" id="file-upload" @change="handleFileChange" />
        <label for="file-upload" class="file-upload-label">Escolher Imagem</label>
        <!-- Aviso de imagem escolhida -->
        <div v-if="imageChosen" class="image-chosen-message">Imagem escolhida!</div>
      </div>

      <input class="input-field" v-model="book.publisher" placeholder="Editora" />
      <textarea class="input-field" v-model="book.synopsis" placeholder="Sinopse (opcional)"></textarea>

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
      imageChosen: false, // Estado do aviso de imagem escolhida
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedImage = event.target.files[0];
      // Definir se a imagem foi escolhida
      this.imageChosen = this.selectedImage ? true : false;
    },
    handleSubmit() {
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

      if (this.book._id) {
        api.updateBook(this.book._id, formData).then(() => {
          this.$emit('book-updated');
          window.location.reload();
        });
      } else {
        api.addBook(formData).then(() => {
          this.$emit('book-added');
          window.location.reload();
        });
      }
    },
  },
};
</script>

<style scoped>
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

.input-field:focus {
  border-color: #4e0a57;
  outline: none;
}

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

.submit-button:hover {
  background-color: #4e0a57;
  transform: scale(1.05);
}

/* Estilos para o botão de upload de arquivo */
.file-input-container {
  position: relative;
  width: 94.5%;  /* Alinha a largura do botão com os outros campos */
  margin: 12px auto; /* Centraliza o contêiner */
  margin-right: 30px;
}

#file-upload {
  display: none; /* Esconde o botão de upload padrão */
}

.file-upload-label {
  font-family: 'Nunito', serif;
  display: inline-block;
  width: 100%;
  padding: 10px;
  background-color: #7a297d;
  color: white;
  text-align: center;
  border: 5px solid #4e0a57; /* Borda igual aos outros campos */
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

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
