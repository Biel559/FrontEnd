<template>
  <div class="dashboard-page">
    <div class="dashboard">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="logo">
          <img src="../assets/dashboardImg/logoIllumine.png" alt="Logo" />
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

      <!-- Sidebar -->
      <div class="content">
        <Sidebar />
        <div class="main-content">
          <div class="title-container">
            <h1 class="title">All Books</h1>
            <img src="../assets/icons/e-book.png" alt="E-Book Icon" class="title-icon" />
          </div>

          <div class="book-grid">
            <!-- Renderiza múltiplos BookCards dinamicamente -->
            <BookCard v-for="(book, index) in books" :key="index" :book="book" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import BookCard from '../components/BookCard.vue';
import api from '../services/api'; // Importe a API para buscar os livros

export default {
  components: {
    Sidebar,
    BookCard,
  },
  data() {
    return {
      books: [], // Lista de livros obtidos da API
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await api.getBooks(); // Busca os livros do banco
        this.books = response.data; // Atualiza a lista de livros
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    },
    goToApp() {
      this.$router.push('/app'); // Redireciona para a nova rota
    },
  },
  mounted() {
    this.fetchBooks(); // Busca os livros ao montar o componente
  },
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@400;700&display=swap');

body,
html {
  margin: 0;
  padding: 0;
}

.dashboard {
  display: flex;
  flex-direction: column;
  background-color: #68B2F8;
  min-height: 100vh;
  /* Garante que cobre toda a altura */
  width: 100vw;
  /* Garante que cobre toda a largura */
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
  /* Garante que ocupe toda a largura */
  z-index: 1000;
  box-sizing: border-box;
  /* Inclui padding dentro do tamanho total */
}


.search-bar {
  flex-grow: 1;
  /* Faz a barra de busca ocupar o espaço restante */
  display: flex;
  /* Para centralizar o input */
  justify-content: center;
  /* Centraliza o input */
}

.search-bar input {
  max-width: 400px;
  /* Aumente a largura máxima do input */
  width: 100%;
  /* Faz o input ocupar 100% do espaço disponível */
  padding: 12px;
  /* Aumenta o padding para um tamanho maior */
  border: none;
  border-radius: 4px;
}



.logo img {
  height: 80px;
  /* Ajuste conforme necessário */
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
  margin-right: 70px;
  /* Adiciona espaço à esquerda dos ícones */
}

.nav-icons .icon {
  color: white;
  text-decoration: none;
  margin-left: 45px;
  /* Reduz a margem entre os ícones */
  font-size: 20px;
  /* Ajuste conforme necessário */
  transition: color 0.3s;
}

.nav-icons img {
  width: 64px;
  /* Ajuste conforme necessário */
  height: 64px;
  /* Ajuste conforme necessário */
}

.content {
  display: flex;
  margin-top: 70px;
  /* Espaço para a navbar */
  height: calc(100vh - 70px);
  /* Altura ajustada com base na navbar */
}

.main-content {
  flex-grow: 1;
  /* Ocupa o restante do espaço ao lado da sidebar */
  padding: 20px;
}

.title-container {
  display: flex; /* Ativa o layout flexível */
  align-items: center; /* Alinha verticalmente ao centro */
  justify-content: flex-start; /* Garante que o texto e ícone comecem juntos */
  gap: 30px; /* Espaço entre o título e o ícone */
  margin-bottom: 50px; /* Espaçamento inferior */
  margin-top: 12px; /* Espaçamento superior */
  padding-left: 900px;
}

.title {
  font-family: "Inika", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  width: 95px; /* Ajuste o tamanho do ícone */
  height: 95px;
}

.book-grid {
  padding-left: 450px;
  /* Mantém o padding ajustado */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  background-color: #68B2F8;
  margin-top: 25px;
  /* Espaçamento entre o título e o grid */
}
</style>
