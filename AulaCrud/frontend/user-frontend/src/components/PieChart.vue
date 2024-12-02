<template>
  <div>
    <h3>{{ title }}</h3>
    <div class="chart-container">
      <canvas ref="chartCanvas" style="width: 700px; max-height: 250px;"></canvas>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default defineComponent({
  props: {
    data: Object,
    title: String,
  },
  setup(props) {
    const chartCanvas = ref(null);

    onMounted(() => {
      new ChartJS(chartCanvas.value, {
        type: 'pie',
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Permite controle mais fácil do layout
          aspectRatio: 1.5, // Ajusta a proporção largura/altura
          layout: {
            padding: {
              right: -225, // Espaço adicional entre o gráfico e a legenda (aumente conforme necessário)
            },
          },
          plugins: {
            legend: {
              position: 'left', // Posiciona a legenda à esquerda
              align: 'start', // Alinhamento vertical
              labels: {
                boxWidth: 20,
                padding: 15, // Espaço entre os itens da legenda
              },
            },
          },
        },
      });
    });

    return {
      chartCanvas,
    };
  },
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: row; /* Exibe o gráfico e a legenda lado a lado */
  justify-content: space-between;
  align-items: center;
}

.chart-container canvas {
  /* Não há mais margem para empurrar, mas o padding no layout do gráfico ajuda */
}
</style>
