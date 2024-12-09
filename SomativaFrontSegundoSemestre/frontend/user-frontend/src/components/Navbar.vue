<template>
  <!-- Estrutura principal da barra de navegação -->
  <nav class="navbar">
    <!-- Logo do sistema com link para a página inicial -->
    <div class="logo">
      <a href=""><img src="../assets/dashboardImg/logoIllumine.png" alt="Logo" @click="goToHome" /></a>
    </div>

    <!-- Contêiner da barra de pesquisa -->
    <div class="InputContainer">
      <!-- Campo de texto para pesquisa -->
      <input 
        :placeholder="placeholder" 
        id="input" 
        class="input" 
        name="text" 
        type="text" 
        v-model="searchQuery" 
        @input="handleSearch" 
      />
      <!-- Ícone de pesquisa exibido ao lado do input -->
      <label class="labelforsearch" for="input">
        <svg class="searchIcon" viewBox="0 0 512 512">
          <path
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
          </path>
        </svg>
      </label>
    </div>

    <!-- Ícones de navegação -->
    <div class="nav-icons">
      <!-- Botão para acessar o CRUD de usuários (visível apenas para Admin e Librarian) -->
      <a v-if="isLibrarianOrAdmin" href="#userCrud" class="icon">
        <img src="../assets/dashboardImg/account.png" alt="" @click="goToUserCrud" />
      </a>

      <!-- Botão para acessar o CRUD de livros (visível apenas para Admin e Librarian) -->
      <a v-if="isLibrarianOrAdmin" href="#crud" class="icon">
        <img src="../assets/dashboardImg/crud.png" alt="" @click="goToApp" />
      </a>

      <!-- Botão para acessar gráficos (visível apenas para Librarian) -->
      <a v-if="isLibrarian" href="#graficos" class="icon">
        <img src="../assets/dashboardImg/chart.png" alt="" @click="goToChart" />
      </a>

      <!-- Botão para exibir notificações -->
      <a href="#notificacoes" class="icon">
        <img src="../assets/dashboardImg/notification.png" alt="" @click="toggleNotifications" />
      </a>

      <!-- Componente de notificações (aparece quando ativado) -->
      <div v-if="showNotifications">
        <notifications v-show="showNotifications" />
      </div>

      <!-- Botão para acessar configurações -->
      <a href="#configuracoes" class="icon">
        <img src="../assets/dashboardImg/config.png" alt="" @click="goToConfig" />
      </a>
    </div>
  </nav>
</template>

<script>
import Notifications from '@/components/Notifications.vue';

export default {
  // Importa o componente de notificações
  components: {
    Notifications,
  },
  data() {
    return {
      searchQuery: '', // Armazena a consulta de pesquisa inserida pelo usuário
      role: localStorage.getItem('role') || 'student', // Recupera a role do usuário do localStorage (padrão: student)
      showNotifications: false, // Controla a exibição das notificações
    };
  },
  computed: {
    // Computed property para verificar se o usuário é Librarian ou Admin
    isLibrarianOrAdmin() {
      return this.role === 'librarian' || this.role === 'admin';
    },
    // Computed property para verificar se o usuário é Librarian
    isLibrarian() {
      return this.role === 'librarian';
    },
    // Computed property para exibir um placeholder adequado no campo de busca
    placeholder() {
      return this.$route.name === 'UserCrud' ? 'Search for a user...' : 'Search for a book...';
    },
  },
  methods: {
    // Alterna a exibição das notificações
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      console.log("Toggle notifications:", this.showNotifications);
    },
    // Navega para a página inicial
    goToHome() {
      this.$router.push('/home');
    },
    // Navega para a página CRUD de livros
    goToApp() {
      this.$router.push('/crud');
    },
    // Navega para a página de gráficos
    goToChart() {
      this.$router.push('/chart');
    },
    // Navega para o CRUD de usuários
    goToUserCrud() {
      this.$router.push('/userCrud');
    },
    // Navega para a página de configurações
    goToConfig() {
      this.$router.push('/config');
    },
    // Emite eventos com base na pesquisa para filtrar livros ou usuários
    handleSearch() {
      if (this.$route.name === 'UserCrud') {
        this.$emit('searchUsers', this.searchQuery); // Pesquisa usuários
      } else {
        this.$emit('filterBooks', this.searchQuery); // Pesquisa livros
      }
    },
  },
};
</script>

<style scoped>
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
  z-index: 900;
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
  -right: 70px;
  position: relative;
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
</style>