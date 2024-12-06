<template>
    <div class="user-list-container">
      <ul class="user-list">
        <li v-for="user in users" :key="user._id" class="user-item">
          <div class="user-info">
            <span class="user-name">Name: {{ user.username }}</span>
            <span class="user-matriculation">Matriculation ID: {{ user.matriculationId }}</span>
            <span class="user-course">Course: {{ user.course }}</span>
            <span class="user-semester">Semester: {{ user.semester }}</span>
            <span class="user-status">Status: {{ user.isActive ? 'Active' : 'Inactive' }}</span>
            
            <div class="user-reservations">
              <h3>Reservations:</h3>
              <ul>
                <li v-for="reservation in user.reservations" :key="reservation._id">
                  Book ID: {{ reservation.bookId }} | Reserved At: {{ new Date(reservation.reservedAt).toLocaleString() }}
                  <button @click="removeReservation(user._id, reservation.bookId)" class="remove-reservation-button">Remove</button>
                </li>
              </ul>
            </div>
  
            <button @click="toggleUserStatus(user._id)" class="toggle-status-button">
              {{ user.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import apiAuth from '../axios';
  
  export default {
    data() {
      return {
        users: [],
      };
    },
    methods: {
      fetchUsers() {
        apiAuth.get('/auth/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      },
      toggleUserStatus(userId) {
        apiAuth.patch(`/auth/users/${userId}/toggle-active`)
          .then(response => {
            this.fetchUsers();
            alert(response.data.message);
          })
          .catch(error => {
            console.error('Error toggling user status:', error);
          });
      },
      removeReservation(userId, bookId) {
        apiAuth.delete(`/auth/users/${userId}/reservations/${bookId}`)
          .then(response => {
            this.fetchUsers();
            alert(response.data.message);
          })
          .catch(error => {
            console.error('Error removing reservation:', error);
          });
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para os botões */
  .toggle-status-button, .remove-reservation-button {
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
  
  .remove-reservation-button {
    background-color: #f44336;
    color: white;
  }
  
  .remove-reservation-button:hover {
    background-color: #e53935;
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
    flex: 1;
    margin-left: 20px;
  }
  
  .user-name, .user-matriculation, .user-course, .user-semester, .user-status {
    font-size: 1rem;
    margin: 5px 0;
  }
  
  h3 {
    margin-top: 10px;
  }
  </style>
  