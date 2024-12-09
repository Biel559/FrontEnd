<template>
  <!-- Contêiner do gráfico de barras -->
  <div>
    <!-- Exibe o título do gráfico, que é passado como prop para o componente -->
    <h3>{{ title }}</h3>
    <!-- Elemento canvas onde o gráfico de barras será renderizado -->
    <canvas ref="chartCanvas" style="width: 700px; max-height: 250px;"></canvas>
  </div>
</template>

<script>
// Importando funções necessárias do Vue e a biblioteca Chart.js
import { defineComponent, onMounted, ref } from 'vue';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Registrar os controladores necessários para a criação de gráficos de barras no Chart.js
ChartJS.register(
  BarElement,       // Define o tipo de gráfico de barras
  CategoryScale,    // Escala para as categorias (eixo X)
  LinearScale,      // Escala linear para os valores (eixo Y)
  Title,            // Adiciona título ao gráfico
  Tooltip,          // Adiciona tooltip (informações ao passar o mouse)
  Legend            // Exibe legenda do gráfico
);

export default defineComponent({
  // Definindo as propriedades (props) que o componente recebe
  props: {
    data: Object,   // Dados do gráfico (deve ser um objeto com as informações)
    title: String,  // Título do gráfico
  },
  setup(props) {
    // Referência para o elemento canvas onde o gráfico será desenhado
    const chartCanvas = ref(null);

    // Método que é executado assim que o componente é montado na tela
    onMounted(() => {
      // Inicializa o gráfico de barras usando o Chart.js e passa a referência do canvas
      new ChartJS(chartCanvas.value, {
        type: 'bar',  // Define o tipo do gráfico como 'bar' (barra)
        data: props.data,  // Passa os dados para o gráfico
        options: {
          responsive: true,              // Faz com que o gráfico se ajuste automaticamente ao tamanho da tela
          maintainAspectRatio: true,     // Garante que o gráfico mantenha a proporção
          aspectRatio: 1,                // Define uma proporção fixa de 1:1 para o gráfico
          plugins: {
            legend: {
              display: false,  // Oculta a legenda do gráfico
            },
          },
        },
      });
    });

    // Retorna a referência do canvas para ser utilizada no template
    return {
      chartCanvas,
    };
  },
});
</script>
