<template>
  <p>{{ mensagem }}</p>
  <p>Contador: {{ contador }}</p>
  <p v-if="mostrar">Texto do Mostrar</p>
    <button @click="incrementar">Clique para incrementar</button>
    <button @click="reset">Reset</button>
    <button @click="mostrando">Mostrar/Ocultar</button>
    <input v-model="nome" placeholder="Digite seu nome">
    <br>
    <p>{{ texto }}</p>
  <ul>
   <li v-for="item in itens" :key="item.text">
    {{ item.text }}
   </li> 
  </ul>
  <input v-model="nome2" placeholder="Digite seu nome">
  <br>
   <p>{{ mensagem2 }} {{ nome2 }}</p>

</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      mensagem: "Bem-vindo ao Vue.js!",
      contador: 0,
      mostrar: false,
      itens: [
        { text:"Ponte Preta"},
        { text:"Guarani"},
        { text:"Novohorizontino"},
        { text:"Ituano"},
        { text:"Mirassol"},
        { text:"RB Bragantino"}
      ],
      nome: "Gabriel",
      nome2: "",
      mensagem2:'Bem vindo',
      texto: "Texto genéricão"
    };
  },
  methods: {
    incrementar() {
      this.contador ++;
    },
    reset() {
      this.contador = 0;
    },
    mostrando() {
      this.mostrar = !this.mostrar;
    },
  },
};
</script>

<style scoped>

p {
  color: green;
}

button {
  margin: 10px;
}
</style>
