<template>
  <div class="dashboard">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/dashboardImg/logoIllumine.png" alt="Logo" />
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Pesquisar..." />
      </div>
      <div class="nav-icons">
        <a href="#crud" class="icon"><img src="../assets/dashboardImg/crud.png" alt=""></a>
        <a href="#graficos" class="icon"><img src="../assets/dashboardImg/chart.png" alt=""></a>
        <a href="#notificacoes" class="icon"><img src="../assets/dashboardImg/notification.png" alt=""></a>
        <a href="#configuracoes" class="icon"><img src="../assets/dashboardImg/config.png" alt=""></a>
      </div>
    </nav>

    <!-- Sidebar -->
    <div class="content">
      <Sidebar />
      <!-- Conteúdo principal pode ir aqui -->
      <div class="main-content">
        <button @click="logout">Sair</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'; // Importação do componente

export default {
  components: {
    Sidebar, // Registra o componente para uso no template
  },
  methods: {
    logout() {
      localStorage.removeItem('token'); // Remove o token JWT
      this.$router.push('/login'); // Redireciona para a página de login
    },
  },
};
</script>


<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
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
  width: 100%; /* Ocupa toda a largura */
  z-index: 1000; /* Garante que fique acima de outros elementos */
}

.search-bar input {
  max-width: 400px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
}

.nav-icons img {
  width: 40px;
  height: 40px;
  margin-left: 20px;
}

.content {
  display: flex;
  margin-top: 70px; /* Espaço para a navbar */
  height: calc(100vh - 70px); /* Altura ajustada com base na navbar */
}

.main-content {
  flex-grow: 1; /* Ocupa o restante do espaço ao lado da sidebar */
  padding: 20px;
}
</style>
