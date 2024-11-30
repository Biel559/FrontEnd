<template>
    <div class="card">
      <!-- Imagem do livro -->
      <div class="img">
        <img 
          :src="book.image ? `${baseURL}${book.image}` : ''" 
          alt="Capa do livro" 
          v-if="book.image" 
        />
      </div>
  
      <!-- Informações do livro -->
      <div class="text">
        <p class="h3">{{ book.title }}</p>
        <p class="p">{{ book.author }} ({{ book.year }})</p>
  
        <!-- Botão Borrow/Reserve -->
        <div class="icon-box">
          <p class="reserve-button" @click="reserveBook">
            Borrow/Reserve
          </p>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      book: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        baseURL: 'http://localhost:3000', // Base URL do backend
      };
    },
    methods: {
  reserveBook() {
    this.$emit('reserve', this.book);
  },
},

  };
  </script>
  
  

<style scoped>
/* From Uiverse.io by waleedlh10 */
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@700&display=swap');
.card {
  width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 14px -2px #bebebe;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.card:hover {
  cursor: pointer;
  transform: translateY(-5px); /* Eleva o card */
  box-shadow: 0px 4px 20px -2px rgba(0, 0, 0, 0.2); /* Intensifica a sombra */
  background-color: #f9f9f9; /* Fundo branco mais claro */
}


.img {
    width: 100%;
    height: 200px; /* Altura reservada para a imagem */
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: linear-gradient(#7980c5, #9198e5);
    display: flex;
    align-items: center; /* Centraliza verticalmente */
    justify-content: center; /* Centraliza horizontalmente */
}

.img img {
    max-width: 90%; /* Ajusta a largura máxima da imagem */
    max-height: 90%; /* Ajusta a altura máxima da imagem */
    object-fit: contain; /* Garante que a imagem não será cortada */
    border-radius: 5px; /* Bordas arredondadas, opcional */
}

.save {
    transition: 0.2s ease-in-out;
    border-radius: 10px;
    margin: 20px;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.save .svg {
    transition: 0.2s ease-in-out;
    width: 15px;
    height: 15px;
}

.save:hover .svg {
    fill: #ced8de;
}

.text {
    padding: 7px 20px;
    display: flex;
    flex-direction: column;
    align-items: space-around;
}

.text .h3 {
    font-family: system-ui;
    font-size: medium;
    font-weight: 600;
    color: black;
    text-align: center;
}

.text .p {
    font-family: system-ui;
    color: #999999;
    font-size: 13px;
    margin: 0px;
    text-align: center;
    padding: 5px;
}

.icon-box {
    font-family: "Inika", serif;
    color: #fff;
    margin: 10px;
    padding: 4px;
    background-color: #7980c5;
    border-radius: 10px;
    text-align: center;
    font-size: small;
}

.icon-box .span {
    font-family: "Inika", serif;
    font-size: small;
    font-weight: 500;
    color: #fff;
}


/*# sourceMappingURL=index.css.map */
</style>