<template>
    <Navbar />
    <div id="app">
      <div class="edit-user-container">
        <h1>Edit User</h1>
        <form @submit.prevent="updateUser">
          <label for="username">Name:</label>
          <input type="text" v-model="user.username" id="username" required />
  
          <label for="course">Course:</label>
          <input type="text" v-model="user.course" id="course" required />
  
          <label for="semester">Semester:</label>
          <input type="text" v-model="user.semester" id="semester" required />
  
          <label for="matriculationId">Matriculation ID:</label>
          <input type="text" v-model="user.matriculationId" id="matriculationId" required />
  
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import apiAuth from '../axios';
  import Navbar from '../components/Navbar';
  
  export default {
    components: {
      Navbar,
    },
    data() {
      return {
        user: {
          username: '',
          course: '',
          semester: '',
          matriculationId: '',
        },
      };
    },
    created() {
      this.fetchUser();
    },
    methods: {
      async fetchUser() {
        const { userId } = this.$route.params; // Pegando o userId da URL
        try {
          const response = await apiAuth.get(`/auth/users/${userId}`);
          if (response.data) {
            this.user = response.data; // Preenche os campos com os dados retornados pela API
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Failed to fetch user data!');
        }
      },
      async updateUser() {
        const { userId } = this.$route.params; // Pegando o userId da URL
        try {
          await apiAuth.put(`/auth/users/${userId}`, this.user);
          alert('User updated successfully!');
          this.$router.push({ name: 'UserCrud' }); // Redireciona para a lista de usuários
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Error updating user. Please try again.');
        }
      },
    },
  };
  </script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');

/* Estilos para o formulário de edição */
.edit-user-container {
    font-family: 'Nunito', serif;
    margin-top: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    width: 50%;
    margin: 0 auto;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin: 10px 0 5px;
}

input {
    padding: 8px;
    font-size: 1rem;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

#app{
    padding-top: 200px;
}
</style>