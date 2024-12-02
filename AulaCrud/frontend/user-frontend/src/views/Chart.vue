<template>
  <div class="charts-page">
    <div class="charts-grid">
      <div v-if="topRatedBooksData" class="chart-box">
        <h3 class="chart-title">Top 5 Rated Books</h3>
        <BarChart :data="topRatedBooksData" />
      </div>
      <div v-else>Loading Top Rated Books...</div>

      <div v-if="genresData" class="chart-box">
        <h3 class="chart-title">Genres with Most Books</h3>
        <div v-if="genresData" class="chart-box-genre">
          <PieChart :data="genresData" />
        </div>
      </div>
      <div v-else>Loading Genres...</div>

      <div v-if="authorsData" class="chart-box">
        <h3 class="chart-title">Top 5 Authors with Most Books</h3>
        <BarChart :data="authorsData" />
      </div>
      <div v-else>Loading Authors...</div>

      <div class="report-box">
        <h3 class="report-title">Generate Report</h3>
        <div class="report-content">
          <img src="../assets/report.png" alt="Report Image" class="report-image" />
          <div class="report-text-button">
            <p>
              This section allows you to generate a comprehensive report, which includes all the charts displayed on the page. 
              You can download a PDF containing the visualizations of top-rated books, most popular genres, and the authors with the largest number of books. 
              This tool will help you keep track of the most important data and is an essential feature for analyzing book statistics efficiently.
              Feel free to explore the charts before generating your report, and make sure to have all the necessary data to make your report complete.
            </p>
            <button class="generate-pdf" @click="generatePDF">Generate PDF</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../services/api';

export default {
  components: {
    BarChart,
    PieChart,
  },
  setup() {
    const topRatedBooksData = ref(null);
    const genresData = ref(null);
    const authorsData = ref(null);

    const fetchChartData = async () => {
      try {
        const { data } = await api.getChartData();
        if (data) {
          if (data.topRatedBooks && Array.isArray(data.topRatedBooks)) {
            topRatedBooksData.value = {
              labels: data.topRatedBooks.map((book) => book.title),
              datasets: [
                {
                  label: "Reviews",
                  data: data.topRatedBooks.map((book) => book.reviews),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            };
          }

          if (data.genres && Array.isArray(data.genres)) {
            const colors = [
              'rgba(255, 99, 132, 0.6)', // Vermelho
              'rgba(54, 162, 235, 0.6)', // Azul
              'rgba(255, 206, 86, 0.6)', // Amarelo
              'rgba(75, 192, 192, 0.6)', // Verde
              'rgba(153, 102, 255, 0.6)', // Roxo
              'rgba(255, 159, 64, 0.6)', // Laranja
              'rgba(255, 99, 71, 0.6)', // Tomate
              'rgba(255, 165, 0, 0.6)', // Laranja escuro
              'rgba(0, 255, 255, 0.6)', // Ciano
              'rgba(255, 105, 180, 0.6)', // Hot pink
              'rgba(0, 255, 0, 0.6)', // Verde claro
              'rgba(0, 0, 255, 0.6)', // Azul claro
              'rgba(128, 0, 128, 0.6)', // Roxo escuro
              'rgba(255, 69, 0, 0.6)', // Laranja avermelhado
              'rgba(124, 252, 0, 0.6)', // Verde limão
              'rgba(173, 216, 230, 0.6)', // Azul claro pastel
              'rgba(255, 20, 147, 0.6)', // Deep pink
              'rgba(210, 105, 30, 0.6)', // Chocolate
              'rgba(32, 178, 170, 0.6)', // Turquesa
              'rgba(255, 228, 181, 0.6)', // Mocca
              'rgba(255, 223, 0, 0.6)', // Amarelo dourado
              'rgba(169, 169, 169, 0.6)', // Cinza claro
            ];

            genresData.value = {
              labels: data.genres.map((genre) => genre.name),
              datasets: [
                {
                  label: "Books",
                  data: data.genres.map((genre) => genre.count),
                  backgroundColor: colors.slice(0, data.genres.length), // Ajusta as cores para o número de gêneros
                },
              ],
            };
          }


          if (data.topAuthors && Array.isArray(data.topAuthors)) {
            authorsData.value = {
              labels: data.topAuthors.map((author) => author.name),
              datasets: [
                {
                  label: "Books",
                  data: data.topAuthors.map((author) => author.count),
                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                },
              ],
            };
          }
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    const generatePDF = async () => {
      try {
        const pdf = new jsPDF();
        const chartContainer = document.querySelector('.charts-grid');

        const canvas = await html2canvas(chartContainer);
        const imageData = canvas.toDataURL('image/png');

        pdf.addImage(imageData, 'PNG', 10, 10, 190, 240);
        pdf.save('charts-report.pdf');
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    onMounted(fetchChartData);

    return {
      topRatedBooksData,
      genresData,
      authorsData,
      generatePDF,
    };
  },
};
</script>


<style scoped>
.charts-page {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  display: flex;
  align-items: center;
  background-color: #651F71;
  padding: 10px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* Garante que ocupe toda a largura */
  z-index: 1000;
  box-sizing: border-box;
  /* Inclui padding dentro do tamanho total */
}


.search-bar {
  flex-grow: 1;
  /* Faz a barra de busca ocupar o espaço restante */
  display: flex;
  /* Para centralizar o input */
  justify-content: center;
  /* Centraliza o input */
}

.search-bar input {
  max-width: 400px;
  /* Aumente a largura máxima do input */
  width: 100%;
  /* Faz o input ocupar 100% do espaço disponível */
  padding: 12px;
  /* Aumenta o padding para um tamanho maior */
  border: none;
  border-radius: 4px;
}



.logo img {
  height: 80px;
  /* Ajuste conforme necessário */
  margin-right: 20px;
}

.InputContainer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  padding-left: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
}

.input {
  width: 570px;
  height: 100%;
  border: none;
  outline: none;
  font-size: 0.9em;
  caret-color: rgb(255, 81, 0);
}

.labelforsearch {
  cursor: text;
  padding: 0px 12px;
}

.searchIcon {
  width: 13px;
}

.border {
  height: 40%;
  width: 1.3px;
  background-color: rgb(223, 223, 223);
}

.micIcon {
  width: 12px;
}

.micButton {
  padding: 0px 15px 0px 12px;
  border: none;
  background-color: transparent;
  height: 40px;
  cursor: pointer;
  transition-duration: 0.3s;
}

.searchIcon path {
  fill: rgb(114, 114, 114);
}

.micIcon path {
  fill: rgb(255, 81, 0);
}

.micButton:hover {
  background-color: rgb(255, 230, 230);
  transition-duration: 0.3s;
}


.nav-icons {
  display: flex;
  -right: 70px;
  /* Adiciona espaço à esquerda dos ícones */
}

.nav-icons .icon {
  color: white;
  text-decoration: none;
  margin-left: 45px;
  /* Reduz a margem entre os ícones */
  font-size: 20px;
  /* Ajuste conforme necessário */
  transition: color 0.3s;
}

.nav-icons img {
  width: 64px;
  /* Ajuste conforme necessário */
  height: 64px;
  /* Ajuste conforme necessário */
}

.content {
  margin-top: 70px;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}

.box {
  background: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.report-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
  height: auto;
}

.report-title {
  font-size: 1.2em;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
}

.report-content {
  display: flex;
  flex-direction: row;
  /* Coloca a imagem e o conteúdo (texto + botão) lado a lado */
  align-items: flex-start;
  /* Alinha o conteúdo no topo, ao lado da imagem */
}

.report-image {
  max-width: 30%;
  /* Define o tamanho da imagem */
  height: auto;
  margin-right: 20px;
  /* Espaçamento entre a imagem e o conteúdo */
}

.report-text-button {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
}

.report-text-button p {
  text-align: justify; /* Justifica o texto */
  line-height: 1.6; /* Aumenta a altura da linha para melhor legibilidade */
}

.pdf-button {
  padding: 10px 20px;
  background-color: #651f71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.pdf-button:hover {
  background-color: #530f5a;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* Mantém 2 colunas */
  gap: 80px;
  /* Define o espaço entre as boxes */
}


.chart-box-genre {
  /* Centraliza verticalmente */
  flex-direction: row;
  /* Coloca legenda e gráfico lado a lado */
}

.chart-box {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* Coloca o título no topo */
  align-items: center;
  padding: 20px;
}


.chart-boxGenre {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* Coloca o título no topo */
  align-items: center;
  padding: 20px;
}

.chart-title {
  font-size: 1.1em;
  /* Tamanho menor para os títulos */
  margin-bottom: 10px;
  /* Espaço entre o título e o gráfico */
  color: #333;
  font-weight: 600;
  text-align: center;
  /* Centraliza o título */
}

.chart-box,
.report-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  /* Adiciona espaçamento interno */
}

.generate-pdf {
  padding: 10px 20px;
  background-color: #651f71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.generate-pdf:hover {
  background-color: #530f5a;
}
</style>