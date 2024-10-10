<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label>Usuário:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Senha:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import api from '../axios'; // Importa a configuração do Axios

export default {
  data() {
    return {
      username: '', // Alterado de 'email' para 'username'
      password: '',
      message: ''
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await api.post('/auth/login', {
          username: this.username, // Altera 'email' para 'username'
          password: this.password,
        });
        this.message = 'Login bem-sucedido!';
        localStorage.setItem('token', response.data.token); // Armazena o token JWT no localStorage
        this.$router.push('/dashboard'); // Redireciona para a página principal após o login
      } catch (error) {
        this.message = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Erro ao fazer login.';
      }
    }
  }
};
</script>
   <style scoped>
   .login {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     height: 100vh;
     background-color: #f7f9fc;
     font-family: 'Arial', sans-serif;
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
   
   div {
     margin-bottom: 15px;
   }
   
   label {
     display: block;
     margin-bottom: 5px;
     font-weight: bold;
     color: #555;
   }
   
   input {
     width: 100%;
     padding: 10px;
     border: 1px solid #ccc;
     border-radius: 4px;
     transition: border-color 0.3s;
   }
   
   input:focus {
     border-color: #007bff;
     outline: none;
   }
   
   button {
     width: 100%;
     padding: 10px;
     background-color: #007bff;
     color: white;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     font-size: 16px;
     transition: background-color 0.3s;
   }
   
   button:hover {
     background-color: #0056b3;
   }
   
   p {
     margin-top: 10px;
     color: #e74c3c;
   }
   </style>
   