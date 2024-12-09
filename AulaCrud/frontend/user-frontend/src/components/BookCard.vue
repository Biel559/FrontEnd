<template>
  <div class="card">
    <!-- Exibe a imagem do livro se a propriedade 'image' do objeto 'book' for fornecida -->
    <div class="img">
      <!-- Usa o baseURL com a imagem do livro e renderiza a imagem se a propriedade 'image' existir -->
      <img 
        :src="book.image ? `${baseURL}${book.image}` : ''"  
        alt="Capa do livro" 
        v-if="book.image" 
      />
    </div>

    <!-- Exibe as informações do livro (título, autor e ano) -->
    <div class="text">
      <p class="h3">{{ book.title }}</p> <!-- Exibe o título do livro -->
      <p class="p">{{ book.author }} ({{ book.year }})</p> <!-- Exibe o autor e o ano do livro -->
    
      <!-- Botão para reservar o livro -->
      <div class="icon-box">
        <p class="reserve-button" @click="reserveBook">
          Borrow/Reserve
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// Script do componente
export default {
  props: {
    book: {
      type: Object,   // Espera um objeto 'book' como prop
      required: true, // A prop 'book' é obrigatória
    },
  },
  data() {
    return {
      baseURL: 'http://localhost:3000', // URL base do backend para buscar as imagens
    };
  },
  methods: {
    // Método chamado quando o botão "Borrow/Reserve" é clicado
    reserveBook() {
      this.$emit('reserve', this.book);  // Emite um evento 'reserve' passando o livro como argumento
    },
  },
};
</script>

<style scoped>
/* Estilo do componente 'card' */
.card {
  width: 280px;  /* Define a largura do card */
  background: white;  /* Fundo branco */
  border-radius: 10px;  /* Bordas arredondadas */
  box-shadow: 0px 0px 14px -2px #bebebe;  /* Sombra suave ao redor do card */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Transições para suavizar animações */
}

.card:hover {
  cursor: pointer;  /* Exibe o cursor como ponteiro quando o mouse está sobre o card */
  transform: translateY(-5px);  /* Eleva o card quando o mouse está sobre ele */
  box-shadow: 0px 4px 20px -2px rgba(0, 0, 0, 0.2);  /* Intensifica a sombra */
  background-color: #f9f9f9;  /* Muda a cor do fundo para um tom mais claro */
}

/* Estilo da imagem do livro */
.img {
  width: 100%;  /* Largura total */
  height: 200px;  /* Altura definida para a imagem */
  border-top-left-radius: 10px;  /* Bordas arredondadas no canto superior esquerdo */
  border-top-right-radius: 10px;  /* Bordas arredondadas no canto superior direito */
  background: linear-gradient(#7980c5, #9198e5);  /* Gradiente de fundo para a área da imagem */
  display: flex;
  align-items: center;  /* Alinha a imagem verticalmente no centro */
  justify-content: center;  /* Alinha a imagem horizontalmente no centro */
}

/* Estilo para a imagem dentro da área .img */
.img img {
  max-width: 90%;  /* Largura máxima de 90% da área disponível */
  max-height: 90%;  /* Altura máxima de 90% da área disponível */
  object-fit: contain;  /* Garante que a imagem não será cortada */
  border-radius: 5px;  /* Bordas arredondadas na imagem */
}

/* Estilo da seção de texto do livro (título, autor, etc.) */
.text {
  padding: 7px 20px;  /* Espaçamento interno do contêiner */
  display: flex;
  flex-direction: column;  /* Exibe os itens em coluna */
  align-items: space-around;  /* Espaçamento entre os itens */
}

/* Estilo do título do livro */
.text .h3 {
  font-family: system-ui;
  font-size: medium;
  font-weight: 600;
  color: black;  /* Cor preta para o título */
  text-align: center;  /* Alinha o título ao centro */
}

/* Estilo do parágrafo com o autor e ano do livro */
.text .p {
  font-family: system-ui;
  color: #999999;  /* Cor cinza claro para o texto */
  font-size: 13px;
  margin: 0px;  /* Remove margem */
  text-align: center;  /* Alinha o texto ao centro */
  padding: 5px;  /* Adiciona um pequeno padding para espaçamento */
}

/* Estilo do contêiner para o botão de reserva */
.icon-box {
  font-family: "Inika", serif;
  color: #fff;  /* Cor do texto branco */
  margin: 10px;
  padding: 4px;
  background-color: #7980c5;  /* Cor de fundo para o botão */
  border-radius: 10px;  /* Bordas arredondadas */
  text-align: center;  /* Alinha o texto ao centro */
  font-size: small;  /* Tamanho da fonte pequeno */
}

/* Estilo para o span dentro do .icon-box (se houver) */
.icon-box .span {
  font-family: "Inika", serif;
  font-size: small;
  font-weight: 500;
  color: #fff;
}
</style>