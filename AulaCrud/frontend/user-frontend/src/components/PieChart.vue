<template>
  <!-- O template define a estrutura HTML do componente -->
  <div>
    <!-- Exibe o título do gráfico, que é passado como prop -->
    <h3>{{ title }}</h3>
    
    <!-- Contêiner para o gráfico, que é um canvas onde o gráfico será renderizado -->
    <div class="chart-container">
      <!-- Referência ao canvas onde o gráfico será desenhado -->
      <canvas ref="chartCanvas" style="width: 700px; max-height: 250px;"></canvas>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
// Importa as funções do Vue para a definição do componente e manipulação do ciclo de vida
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// Importa a biblioteca Chart.js e os elementos necessários para criar um gráfico do tipo 'pie'

ChartJS.register(ArcElement, Title, Tooltip, Legend);
// Registra os elementos necessários para o gráfico 'pie' (gráfico de pizza) no Chart.js

export default defineComponent({
  // Define o componente Vue, usando a função 'defineComponent'
  props: {
    data: Object,  // A prop 'data' será um objeto com os dados que serão usados para criar o gráfico
    title: String, // A prop 'title' será uma string que define o título do gráfico
  },
  setup(props) {
    // Função 'setup' é usada para inicializar o estado do componente em Vue 3
    const chartCanvas = ref(null); // Cria uma referência ao canvas onde o gráfico será desenhado

    onMounted(() => {
      // 'onMounted' é um hook do ciclo de vida do Vue que é executado após o componente ser montado no DOM
      new ChartJS(chartCanvas.value, {
        type: 'pie', // Define que o gráfico será do tipo 'pie' (pizza)
        data: props.data, // Passa os dados do gráfico para o gráfico do Chart.js
        options: {
          responsive: true, // Faz o gráfico ser responsivo, ajustando-se automaticamente ao tamanho da tela
          maintainAspectRatio: false, // Permite o controle do layout do gráfico, alterando sua proporção
          aspectRatio: 1.5, // Define a proporção de largura para altura do gráfico
          layout: {
            padding: {
              right: -225, // Ajusta o espaço à direita do gráfico, necessário para a legenda
            },
          },
          plugins: {
            legend: {
              position: 'left', // A posição da legenda é à esquerda
              align: 'start', // A legenda será alinhada ao topo
              labels: {
                boxWidth: 20, // Define a largura das caixas de legenda
                padding: 15, // Espaçamento entre os itens da legenda
              },
            },
          },
        },
      });
    });

    return {
      chartCanvas, // Retorna a referência ao canvas para que o Chart.js possa desenhá-lo
    };
  },
});
</script>

<style scoped>
/* Estilos para o componente */
.chart-container {
  display: flex; /* Exibe o conteúdo do contêiner como um flexbox */
  flex-direction: row; /* Organiza os itens em linha (horizontais) */
  justify-content: space-between; /* Espaça o gráfico e a legenda de maneira equilibrada */
  align-items: center; /* Alinha os itens verticalmente no centro */
}

.chart-container canvas {
  /* Não há mais necessidade de margens para empurrar o gráfico, mas o padding no layout do gráfico ajuda */
}
</style>