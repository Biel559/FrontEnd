<template>
  <div class="login">
    <!-- Exibe o logo da biblioteca -->
    <img src="../assets/IllumineLogo.png" alt="Logo da Biblioteca" class="logo" />

    <!-- Botão estilizado que mostra o texto "SignUp" ao passar o mouse -->
    <button class="button login-title-button" data-text="Login">
      <span class="actual-text">&nbsp;SignUp&nbsp;</span>
      <span aria-hidden="true" class="hover-text">&nbsp;SignUp&nbsp;</span>
    </button>

    <!-- Formulário de criação de usuário -->
    <form @submit.prevent="criarUser">
      <!-- Campo para o nome de usuário -->
      <div class="container">
        <input v-model="username" type="text" name="text" class="input" required />
        <label class="label">Enter your profile name</label>
      </div>
      <!-- Campo para a senha -->
      <div class="container">
        <input v-model="password" type="password" name="password" class="input" required />
        <label class="label">Create a password</label>
      </div>
      <!-- Campo para o ID de matrícula -->
      <div class="container">
        <input v-model="matriculationId" type="text" class="input" required />
        <label class="label">Enter your Matriculation ID</label>
      </div>
      <!-- Campo para o curso -->
      <div class="container">
        <input v-model="course" type="text" class="input" required />
        <label class="label">Enter your Course</label>
      </div>
      <!-- Campo para o semestre -->
      <div class="container">
        <input v-model="semester" type="text" class="input" required />
        <label class="label">Enter your Semester</label>
      </div>
      <!-- Botão para voltar à página de login -->
      <button class="form-submit-button" @click="goToLogin" type="button">Back</button>
      <!-- Botão para criar a conta -->
      <button class="form-submit-button" type="submit">Create Account</button>
    </form>
    <!-- Exibe uma mensagem de erro ou sucesso -->
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import api from "../axios"; // Importa a instância do Axios para realizar requisições

export default {
  data() {
    return {
      // Variáveis para armazenar os dados do formulário
      username: "",
      password: "",
      matriculationId: "",
      course: "",
      semester: "",
      message: "" // Mensagem de erro ou sucesso
    };
  },
  methods: {
    // Método para criar um usuário
    async criarUser() {
      try {
        // Envia os dados para a API de registro
        const response = await api.post("/auth/register", {
          username: this.username,
          password: this.password,
          matriculationId: this.matriculationId,
          course: this.course,
          semester: this.semester,
          role: "student" // Define a role como "student"
        });
        // Atualiza a mensagem para sucesso
        this.message = "Conta criada com sucesso!";
        // Armazena o token recebido no localStorage
        localStorage.setItem("token", response.data.token);
        // Redireciona o usuário para a página de login
        this.$router.push("/login");
      } catch (error) {
        // Atualiza a mensagem com o erro, se houver
        this.message =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Erro ao criar conta.";
      }
    },
    // Método para redirecionar para a página de login
    goToLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');
  
  body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #651F71; /* Define a cor de fundo */
  overflow: hidden; /* Evita barras de rolagem indesejadas */
  box-sizing: border-box; /* Inclui padding e bordas no tamanho do elemento */
}

  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f7f9fc;
    font-family: 'Arial', sans-serif;
    background-color: #651F71; /* Define a cor de fundo */
  }
  
  .logo {
  width:220px; /* Ajuste o tamanho da logo conforme necessário */
  height: auto;
  padding-left: 5px;
  margin-bottom: 20px; /* Espaço entre a logo e o título */
}

  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  form {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
  }
  
  .container {
    font-family: 'Nunito', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    color: black; /* Mudando a cor do texto para preto */
    margin-bottom: 30px; /* Espaçamento entre os inputs */
    margin-top: 20px;;
  }
  
  .container .label {
    font-size: 15px;
    padding-left: 10px;
    position: absolute;
    top: 13px;
    transition: 0.3s;
    pointer-events: none;
  }
  
  .input {
    width: 96%; /* Ajuste para ocupar toda a largura do contêiner */
    height: 45px;
    border: none;
    outline: none;
    padding: 0px 7px;
    border-radius: 6px;
    color: #000000; /* Mantendo a cor do texto do input */
    font-size: 15px;
    background-color: transparent;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 1),
                -1px -1px 6px rgba(255, 255, 255, 0.4);
  }
  
  .input:focus {
    border: 2px solid transparent;
    color: #000000; /* Mantendo a cor do texto do input em foco */
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 1),
                -1px -1px 6px rgba(255, 255, 255, 0.4),
                inset 3px 3px 10px rgba(0, 0, 0, 1),
                inset -1px -1px 6px rgba(255, 255, 255, 0.4);
  }
  
  .container .input:valid ~ .label,
  .container .input:focus ~ .label {
    transition: 0.3s;
    padding-left: 2px;
    transform: translateY(-35px);
  }
  
  .container .input:valid,
  .container .input:focus {
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 1),
                -1px -1px 6px rgba(255, 255, 255, 0.4),
                inset 3px 3px 10px rgba(0, 0, 0, 1),
                inset -1px -1px 6px rgba(255, 255, 255, 0.4);
  }
  
  /* Estilos aplicados apenas ao botão de Login (em cima dos inputs) */
  .login-title-button {
    margin: 0;
    margin-bottom: 30px;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
  }
  
  .login-title-button {
    --border-right: 6px;
    --text-stroke-color: rgb(255, 255, 255);
    --animation-color: #ffffff;
    --fs-size: 2em;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: 80px;
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }
  
  /* Estilo do texto quando o mouse está sobre o botão */
  .login-title-button .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }
  
  /* Efeito hover no botão */
  .login-title-button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }
  
  
  /* Estilos aplicados apenas ao botão de envio do formulário */
  .form-submit-button {
    margin-left: 10px;
    padding: 15px 20px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 1000;
    font-size: 17px;
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
    overflow: hidden;
  }
  
  .form-submit-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: #212121;
    z-index: -1;
    box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
    transition: all 250ms;
  }
  
  .form-submit-button:hover {
    color: #e8e8e8;
    cursor: pointer;
  }
  
  .form-submit-button:hover::before {
    width: 100%;
  }
  
  
  p {
    margin-top: 10px;
    color: #e74c3c;
  }
  </style>  