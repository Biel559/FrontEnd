<template>
     <div class="dashboard">
       <h1>Bem-vindo ao Dashboard!</h1>
       <p>Você está autenticado.</p>
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
   <style scoped>
   .dashboard {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     height: 100vh;
     background-color: #e9ecef;
     font-family: 'Arial', sans-serif;
     text-align: center;
   }
   
   h1 {
     color: #333;
     margin-bottom: 20px;
   }
   
   p {
     color: #555;
     margin-bottom: 30px;
   }
   
   button {
     padding: 10px 20px;
     background-color: #dc3545;
     color: white;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     font-size: 16px;
     transition: background-color 0.3s, transform 0.2s;
   }
   
   button:hover {
     background-color: #c82333;
     transform: scale(1.05);
   }
   
   button:focus {
     outline: none;
     box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.5);
   }
   </style>
   