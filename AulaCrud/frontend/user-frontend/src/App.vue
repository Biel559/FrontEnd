<template>
<div id="app">
  <nav>
    <router-link to="/login"></router-link>
    <router-link to="/dashboard"></router-link>
  </nav>
  <router-view></router-view> <!-- Renderiza o componente da rota ativa -->
</div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
nav{
  margin-bottom: 20px;
}
</style>
