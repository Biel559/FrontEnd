<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">
        <a href=""><img src="../assets/dashboardImg/logoIllumine.png" alt="Logo" @click="goToHome"/></a>
      </div>
      <div class="InputContainer">
        <input placeholder="Search for a book..." id="input" class="input" name="text" type="text" />
        <label class="labelforsearch" for="input">
          <svg class="searchIcon" viewBox="0 0 512 512">
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
            </path>
          </svg>
        </label>
      </div>
      <div class="nav-icons">
        <a href="#crud" class="icon"><img src="../assets/dashboardImg/crud.png" alt=""@click="goToApp"></a>
        <a href="#graficos" class="icon"><img src="../assets/dashboardImg/chart.png" alt=""></a>
        <a href="#notificacoes" class="icon"><img src="../assets/dashboardImg/notification.png" alt=""></a>
        <a href="#configuracoes" class="icon"><img src="../assets/dashboardImg/config.png" alt=""></a>
      </div>
    </nav>

    <div class="main-content">
      <div class="title-container">
        <h1 class="title">Add Books</h1>
        <img src="../assets/img/bookAdd.png" alt="E-Book Icon" class="title-icon" />
      </div>
    </div>          
    <!-- Componente para o formulário de livros, passando o livro a ser editado e emitindo eventos -->
    <BookForm :bookToEdit="bookToEdit" @book-added="fetchBooks" @book-updated="fetchBooks" />
    
    <!-- Componente para listar os livros, emitindo um evento ao editar um livro -->
    <BookList @edit-book="setBookToEdit" ref="bookList" />
  </div>
</template> 

<script>
// Importa os componentes BookList e BookForm
import BookList from '../components/BookList.vue';
import BookForm from '../components/BookForm.vue';

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
    goToHome() {
      this.$router.push('/dashboard'); // Redireciona para a nova rota
    },
  },
  mounted() {
    this.fetchBooks(); // Adiciona isso para garantir que a lista de livros seja carregada ao inicializar o componente
  },
};
</script>

<style scoped>
.app {
  background-color: #68B2F8;
}

.navbar {
  display: flex;
  align-items: center;
  background-color: #651F71;
  padding: 10px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.search-bar {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.search-bar input {
  max-width: 400px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
}

.logo img {
  height: 80px;
  margin-right: 20px;
}

.InputContainer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  padding-left: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
}

.input {
  width: 570px;
  height: 100%;
  border: none;
  outline: none;
  font-size: 0.9em;
  caret-color: rgb(255, 81, 0);
}

.labelforsearch {
  cursor: text;
  padding: 0px 12px;
}

.searchIcon {
  width: 13px;
}

.border {
  height: 40%;
  width: 1.3px;
  background-color: rgb(223, 223, 223);
}

.micIcon {
  width: 12px;
}

.micButton {
  padding: 0px 15px 0px 12px;
  border: none;
  background-color: transparent;
  height: 40px;
  cursor: pointer;
  transition-duration: 0.3s;
}

.searchIcon path {
  fill: rgb(114, 114, 114);
}

.micIcon path {
  fill: rgb(255, 81, 0);
}

.micButton:hover {
  background-color: rgb(255, 230, 230);
  transition-duration: 0.3s;
}

.nav-icons {
  display: flex;
}

.nav-icons .icon {
  color: white;
  text-decoration: none;
  margin-left: 45px;
  font-size: 20px;
  transition: color 0.3s;
}

.nav-icons img {
  width: 64px;
  height: 64px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Alinha o conteúdo horizontalmente no centro */
  gap: 40px;
  margin-bottom: 50px;
  margin-top: 12px;
}

.title {
  font-family: "Inika", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  width: 95px;
  height: 95px;
}

#app {
  padding-top: 100px;
}
</style>