<template>
  <Navbar />
  <div id="app">
    <div class="title-container">
      <h1 class="title">Manage Users</h1>
      <img src="../assets/img/userCrudTitle.png" alt="E-Book Icon" class="title-icon" />
    </div>
    <UserList />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import UserList from '../components/UserList.vue';

export default {
  name: "UserCrud",

  components: {
    Navbar,
    UserList,
  },
};
</script>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 50px;
  margin-top: 12px;
}

.title {
  font-family: "Inika", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  width: 95px;
  height: 95px;
}

#app {
  padding-top: 100px;
}
</style>