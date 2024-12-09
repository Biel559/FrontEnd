<template>
  <div class="user-list-container">
    <ul class="user-list">
      <li v-for="user in filteredUsers" :key="user._id" class="user-item">
        <div class="user-info">
          <span class="user-name">Name: {{ user.username }}</span>
          <template v-if="user.role === 'student'">
            <span class="user-matriculation">Matriculation ID: {{ user.matriculationId }}</span>
            <span class="user-course">Course: {{ user.course }}</span>
            <span class="user-semester">Semester: {{ user.semester }}</span>
          </template>
          <span class="user-status">Status: {{ user.isActive ? 'Active' : 'Inactive' }}</span>
          <div class="user-reservations">
            <h3>Reservations:</h3>
            <ul>
              <li v-for="reservation in user.reservations" :key="reservation._id">
                Book Title: {{ getBookTitle(reservation.bookId) }} |
                Reserved At: {{ new Date(reservation.reservedAt).toLocaleString() }}
                <button @click="removeReservation(user._id, reservation.bookId)" class="remove-reservation-button">
                  Remove
                </button>
              </li>
            </ul>
          </div>
          <button v-if="user.role === 'student'" @click="toggleUserStatus(user._id)"
            :class="['toggle-status-button', user.isActive ? 'deactivate' : 'activate']">
            {{ user.isActive ? 'Deactivate' : 'Activate' }}
          </button>
          <button @click="editUser(user)" class="edit-button">
            Edit
          </button>

        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import apiAuth from '../axios';
import apiLibrary from '../services/api';

export default {
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      users: [],
      bookTitles: {}, // Cache para armazenar títulos de livros
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.matriculationId?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apiAuth.get('/auth/users');
        this.users = response.data;

        // Buscar títulos dos livros para todas as reservas
        const bookIds = [
          ...new Set(
            this.users.flatMap((user) =>
              user.reservations.map((reservation) => reservation.bookId)
            )
          ),
        ];

        // Buscar títulos dos livros
        await this.fetchBookTitles(bookIds);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchBookTitles(bookIds) {
      try {
        const response = await apiLibrary.getBooks();
        const books = response.data;

        // Criar um mapeamento de ID para título
        this.bookTitles = bookIds.reduce((acc, id) => {
          const book = books.find((b) => b._id === id);
          if (book) acc[id] = book.title;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching book titles:', error);
      }
    },
    getBookTitle(bookId) {
      // Retorna o título do livro ou o ID se o título não for encontrado
      return this.bookTitles[bookId] || bookId;
    },
    toggleUserStatus(userId) {
      apiAuth.patch(`/auth/users/${userId}/toggle-active`)
        .then((response) => {
          this.fetchUsers();
          alert(response.data.message);
        })
        .catch((error) => {
          console.error('Error toggling user status:', error);
        });
    },
    async removeReservation(userId, bookId) {
      try {
        // Remover a reserva no auth-api
        await apiAuth.delete(`/auth/users/${userId}/reservations/${bookId}`);
        console.log('Reserva removida com sucesso.');

        // Aumentar a quantidade do livro no library-backend
        const response = await apiLibrary.increaseBookQuantity(bookId, 1);
        console.log('Quantidade aumentada com sucesso:', response.data);

        // Atualizar a lista de usuários
        this.fetchUsers();

        alert('Reserva removida e quantidade do livro atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao remover reserva ou atualizar quantidade:', error.response || error);
        alert('Erro ao remover a reserva. Por favor, tente novamente.');
      }
    },
    editUser(user) {
      // Navegar para uma página de edição (exemplo usando Vue Router)
      this.$router.push({ name: 'EditUser', params: { userId: user._id } });
    },
  },
  mounted() {
    this.fetchUsers();
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