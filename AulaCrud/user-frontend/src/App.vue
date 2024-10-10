<template>
<div id="app">
  <nav>
    <router-link to="/login">Login</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
  </nav>
  <router-view></router-view> <!-- Renderiza o componente da rota ativa -->
</div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
nav{
  margin-bottom: 20px;
}
</style>
