<template>
    <div>
      <h3>{{ title }}</h3>
      <canvas ref="chartCanvas" style="width: 700px; max-height: 250px;"></canvas>
    </div>
  </template>
  
  <script>
  import { defineComponent, onMounted, ref } from 'vue';
  import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
  
  // Registrar manualmente os controladores necessários para gráficos de barras
  ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
  );
  
  export default defineComponent({
    props: {
      data: Object,
      title: String,
    },
    setup(props) {
      const chartCanvas = ref(null);
  
      onMounted(() => {
        new ChartJS(chartCanvas.value, {
          type: 'bar',
          data: props.data,
          options: {
            responsive: true,
            maintainAspectRatio: true,  // Impede o gráfico de aumentar demais
            aspectRatio: 1,  // Definindo uma proporção fixa para o gráfico
            plugins: {
              legend: {
                display: false,
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