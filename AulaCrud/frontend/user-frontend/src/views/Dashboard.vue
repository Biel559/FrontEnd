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

    <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token'); // Remove o token JWT
      this.$router.push('/login'); // Redireciona para a página de login
    }
  }
};
</script>

<style scoped src="../assets/dashboard.css">
</style>
