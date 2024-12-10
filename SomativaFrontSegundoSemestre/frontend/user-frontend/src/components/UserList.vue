<template>
  <div class="user-list-container">
    <!-- Contêiner principal que encapsula a lista de usuários -->
    <ul class="user-list">
      <!-- Itera sobre a lista de usuários filtrados -->
      <li v-for="user in filteredUsers" :key="user._id" class="user-item">
        <!-- Cada item da lista representa um usuário -->
        <div class="user-info">
          <!-- Exibe o nome do usuário -->
          <span class="user-name">Name: {{ user.username }}</span>

          <!-- Exibe informações adicionais apenas para usuários do tipo 'student' -->
          <template v-if="user.role === 'student'">
            <span class="user-matriculation">Matriculation ID: {{ user.matriculationId }}</span>
            <span class="user-course">Course: {{ user.course }}</span>
            <span class="user-semester">Semester: {{ user.semester }}</span>
          </template>

          <!-- Exibe o status do usuário (Ativo/Inativo) -->
          <span class="user-status">Status: {{ user.isActive ? 'Active' : 'Inactive' }}</span>

          <!-- Lista de reservas do usuário -->
          <div class="user-reservations">
            <h3>Reservations:</h3>
            <ul>
              <!-- Itera sobre as reservas do usuário -->
              <li v-for="reservation in user.reservations" :key="reservation._id">
                <!-- Exibe o título do livro e a data da reserva -->
                Book Title: {{ getBookTitle(reservation.bookId) }} |
                Reserved At: {{ new Date(reservation.reservedAt).toLocaleString() }}
                <!-- Botão para remover a reserva -->
                <button @click="removeReservation(user._id, reservation.bookId)" class="remove-reservation-button">
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <!-- Botão para ativar/desativar o usuário (apenas para 'students') -->
          <button v-if="user.role === 'student'" @click="toggleUserStatus(user._id)"
            :class="['toggle-status-button', user.isActive ? 'deactivate' : 'activate']">
            {{ user.isActive ? 'Deactivate' : 'Activate' }}
          </button>

          <!-- Botão para editar o usuário -->
          <button @click="editUser(user)" class="edit-button">
            Edit
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import apiAuth from '../axios'; // Importa a API de autenticação
import apiLibrary from '../services/api'; // Importa a API da biblioteca

export default {
  props: {
    // Recebe o termo de pesquisa como propriedade
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      users: [], // Lista de usuários carregados
      bookTitles: {}, // Cache de títulos de livros
    };
  },
  computed: {
    // Computed que filtra os usuários com base no termo de pesquisa
    filteredUsers() {
      return this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.matriculationId?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Busca a lista de usuários e os títulos de livros associados
    async fetchUsers() {
      try {
        const response = await apiAuth.get('/auth/users');
        this.users = response.data; // Atualiza a lista de usuários

        // Coleta todos os IDs de livros únicos das reservas
        const bookIds = [
          ...new Set(
            this.users.flatMap((user) =>
              user.reservations.map((reservation) => reservation.bookId)
            )
          ),
        ];

        // Busca os títulos dos livros
        await this.fetchBookTitles(bookIds);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    // Busca os títulos dos livros com base nos IDs
    async fetchBookTitles(bookIds) {
      try {
        const response = await apiLibrary.getBooks();
        const books = response.data;

        // Cria um mapeamento de ID para título
        this.bookTitles = bookIds.reduce((acc, id) => {
          const book = books.find((b) => b._id === id);
          if (book) acc[id] = book.title;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching book titles:', error);
      }
    },
    // Obtém o título do livro pelo ID, retornando o ID caso o título não seja encontrado
    getBookTitle(bookId) {
      return this.bookTitles[bookId] || bookId;
    },
    // Alterna o status ativo/inativo de um usuário
    toggleUserStatus(userId) {
      apiAuth.patch(`/auth/users/${userId}/toggle-active`)
        .then((response) => {
          this.fetchUsers(); // Atualiza a lista de usuários
          alert(response.data.message); // Exibe uma mensagem de sucesso
        })
        .catch((error) => {
          console.error('Error toggling user status:', error);
        });
    },
    // Remove uma reserva e atualiza a quantidade de livros no backend
    async removeReservation(userId, bookId) {
      try {
        // Remove a reserva do usuário
        await apiAuth.delete(`/auth/users/${userId}/reservations/${bookId}`);
        console.log('Reserva removida com sucesso.');

        // Atualiza a quantidade do livro
        const response = await apiLibrary.increaseBookQuantity(bookId, 1);
        console.log('Quantidade aumentada com sucesso:', response.data);

        // Atualiza a lista de usuários
        this.fetchUsers();

        alert('Reserva removida e quantidade do livro atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao remover reserva ou atualizar quantidade:', error.response || error);
        alert('Erro ao remover a reserva. Por favor, tente novamente.');
      }
    },
    // Navega para a página de edição de usuário
    editUser(user) {
      this.$router.push({ name: 'EditUser', params: { userId: user._id } });
    },
  },
  // Executa ao montar o componente
  mounted() {
    this.fetchUsers(); // Busca a lista de usuários ao iniciar
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');

/* Estilos para os botões */
.toggle-status-button,
.remove-reservation-button {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
}

.toggle-status-button {
  background-color: #4caf50;
  color: white;
}

.toggle-status-button:hover {
  background-color: #45a049;
}

/* Botão para ativar (verde) */
.toggle-status-button.activate {
  background-color: #4caf50;
  color: white;
}

.toggle-status-button.activate:hover {
  background-color: #45a049;
}

/* Botão para desativar (vermelho) */
.toggle-status-button.deactivate {
  background-color: #f44336;
  color: white;
}

.toggle-status-button.deactivate:hover {
  background-color: #e53935;
}


.remove-reservation-button {
  background-color: #f44336;
  color: white;
}

.remove-reservation-button:hover {
  background-color: #e53935;
}

/* Botão de editar com cor azul */
.edit-button {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
  background-color: #2196f3;
  /* Azul */
  color: white;
  padding: 8px 12px;
}

.edit-button:hover {
  background-color: #1976d2;
  /* Tom mais escuro de azul ao passar o mouse */
}


/* Estilos gerais */
.user-list-container {
  margin-top: 20px;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 15px;
  border: 3px solid #80cbc4;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #b2dfdb;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #a7ffeb;
}

.user-info {
  font-family: 'Nunito';
  display: flex;
  flex-direction: column;
  /* Organiza os filhos verticalmente */
  gap: 10px;
  /* Espaçamento entre os itens */
}

.user-info div {
  font-size: 1rem;
  margin: 5px 0;
}


.user-name,
.user-matriculation,
.user-course,
.user-semester,
.user-status {
  font-size: 1rem;
  margin: 5px 0;
}

h3 {
  margin-top: 10px;
}
</style>