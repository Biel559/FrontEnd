<template>
  <div class="config-page">
    <Navbar />
    <div class="config-container">
      <h2 class="config-title">
        Configurations
        <img src="../assets/img/settings.png" alt="Settings Icon" class="icon-image" />
      </h2>
      <div class="config-box">
        <h3 class="config-subtitle">Notice!</h3>
        <h4 class="policy-title">Loan Policy:</h4>
        <p class="policy-text">
          Library users can borrow a maximum of 3 books at a time. Each book must be returned within 14 days from the
          borrowing date.
          Late returns may result in penalties as outlined in the library's terms of use. Extensions can be requested,
          subject to availability
          and approval by the librarian. Please handle books with care to ensure they remain in good condition for
          future borrowers.
        </p>
      </div>
      <div v-if="isLibrarianAdmin" class="config-box">
        <h3 class="config-subtitle">Administer the Reservation Limit</h3>
        <div class="input-container">
          <label for="reservationLimit">New Reservation Limit:</label>
          <input type="number" id="reservationLimit" v-model="reservationLimit" min="1" step="1" class="input-field" />
        </div>
        <button @click="saveChanges" class="save-button">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import api from "../axios";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isLibrarian: false,
      reservationLimit: 3, // Default value
    };
  },
  mounted() {
    this.checkIfLibrarian();
  },
  methods: {
    // Check if the user is a librarian based on localStorage
    checkIfLibrarian() {
      const role = localStorage.getItem('role');
      if (role === 'librarian' || role ==='admin') {
        this.isLibrarianAdmin = true;
      }
    },
    async saveChanges() {
      try {
        // Send PATCH request to update reservation limit for all users
        const response = await api.patch('auth/users/update-reservation-limit', { newLimit: this.reservationLimit });
        alert(response.data.message);
      } catch (error) {
        alert('Error saving changes: ' + error.response.data.error);
      }
    }
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@400;700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");

.config-page {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
}

.config-container {
  width: 80%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.config-title {
  font-family: 'Inika', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.icon-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.config-box {
  font-family: 'Nunito', sans-serif;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 10px
}

.config-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #444;
  text-align: left;
}

.policy-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #651f71;
  margin-top: 10px;
}

.policy-text {
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
  color: #666;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
}

.save-button {
  background-color: #651f71;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 15px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #550e58;
}
</style>