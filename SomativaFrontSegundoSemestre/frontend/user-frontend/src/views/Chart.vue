<template>
  <!-- Estrutura principal da página de gráficos -->
  <div class="charts-page">
    <!-- Navbar é um componente reutilizável, usado para navegação -->
    <Navbar />

    <!-- Grid onde os gráficos e a caixa de relatório são exibidos -->
    <div class="charts-grid">
      <!-- Caixa do gráfico dos livros mais bem avaliados -->
      <div v-if="topRatedBooksData" class="chart-box">
        <h3 class="chart-title">Top 5 Rated Books</h3>
        <!-- Componente de gráfico de barras que recebe os dados via prop -->
        <BarChart :data="topRatedBooksData" />
      </div>
      <!-- Exibe uma mensagem enquanto os dados ainda estão sendo carregados -->
      <div v-else>Loading Top Rated Books...</div>

      <!-- Caixa do gráfico dos gêneros com mais livros -->
      <div v-if="genresData" class="chart-box">
        <h3 class="chart-title">Genres with Most Books</h3>
        <div v-if="genresData" class="chart-box-genre">
          <!-- Componente de gráfico de pizza que recebe os dados via prop -->
          <PieChart :data="genresData" />
        </div>
      </div>
      <!-- Exibe uma mensagem enquanto os dados ainda estão sendo carregados -->
      <div v-else>Loading Genres...</div>

      <!-- Caixa do gráfico dos autores com mais livros -->
      <div v-if="authorsData" class="chart-box">
        <h3 class="chart-title">Top 5 Authors with Most Books</h3>
        <!-- Componente de gráfico de barras que recebe os dados via prop -->
        <BarChart :data="authorsData" />
      </div>
      <!-- Exibe uma mensagem enquanto os dados ainda estão sendo carregados -->
      <div v-else>Loading Authors...</div>

      <!-- Caixa de geração de relatórios -->
      <div class="report-box">
        <h3 class="report-title">Generate Report</h3>
        <div class="report-content">
          <!-- Imagem ilustrativa do relatório -->
          <img src="../assets/report.png" alt="Report Image" class="report-image" />
          <div class="report-text-button">
            <!-- Texto explicativo sobre a funcionalidade do relatório -->
            <p>
              This section allows you to generate a comprehensive report, which includes all the charts displayed on the page. 
              You can download a PDF containing the visualizations of top-rated books, most popular genres, and the authors with the largest number of books. 
              This tool will help you keep track of the most important data and is an essential feature for analyzing book statistics efficiently.
              Feel free to explore the charts before generating your report, and make sure to have all the necessary data to make your report complete.
            </p>
            <!-- Botão para gerar o PDF -->
            <button class="generate-pdf" @click="generatePDF">Generate PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'; // Importação de hooks do Vue para reatividade e ciclo de vida
import Navbar from '../components/Navbar.vue'; // Navbar importada como componente
import BarChart from '../components/BarChart.vue'; // Componente de gráfico de barras
import PieChart from '../components/PieChart.vue'; // Componente de gráfico de pizza
import jsPDF from 'jspdf'; // Biblioteca para geração de PDFs
import html2canvas from 'html2canvas'; // Biblioteca para capturar a página como imagem
import api from '../services/api'; // Serviço de API para buscar dados do backend

export default {
  components: {
    BarChart, // Registro do componente BarChart
    PieChart, // Registro do componente PieChart
    Navbar, // Registro do componente Navbar
  },
  setup() {
    // Referências reativas para armazenar os dados dos gráficos
    const topRatedBooksData = ref(null);
    const genresData = ref(null);
    const authorsData = ref(null);

    // Função para buscar os dados dos gráficos na API
    const fetchChartData = async () => {
      try {
        const { data } = await api.getChartData(); // Chama o endpoint de API
        if (data) {
          // Prepara os dados para o gráfico de livros mais bem avaliados
          if (data.topRatedBooks && Array.isArray(data.topRatedBooks)) {
            const colors = [
              'rgba(255, 99, 132, 0.6)', // Lista de cores para os gráficos
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ];

            topRatedBooksData.value = {
              labels: data.topRatedBooks.map((book) => book.title), // Rótulos baseados nos títulos dos livros
              datasets: [
                {
                  label: "Reviews", // Rótulo do dataset
                  data: data.topRatedBooks.map((book) => book.reviews), // Dados das avaliações
                  backgroundColor: colors.slice(0, data.topRatedBooks.length), // Aplica cores
                },
              ],
            };
          }

          // Prepara os dados para o gráfico de gêneros literários
          if (data.genres && Array.isArray(data.genres)) {
            const colors = [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ];

            genresData.value = {
              labels: data.genres.map((genre) => genre.name), // Rótulos baseados nos nomes dos gêneros
              datasets: [
                {
                  label: "Books", // Rótulo do dataset
                  data: data.genres.map((genre) => genre.count), // Quantidade de livros por gênero
                  backgroundColor: colors.slice(0, data.genres.length), // Aplica cores
                },
              ],
            };
          }

          // Prepara os dados para o gráfico de autores mais prolíficos
          if (data.topAuthors && Array.isArray(data.topAuthors)) {
            const colors = [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ];

            authorsData.value = {
              labels: data.topAuthors.map((author) => author.name), // Rótulos baseados nos nomes dos autores
              datasets: [
                {
                  label: "Books", // Rótulo do dataset
                  data: data.topAuthors.map((author) => author.count), // Quantidade de livros por autor
                  backgroundColor: colors.slice(0, data.topAuthors.length), // Aplica cores
                },
              ],
            };
          }
        }
      } catch (error) {
        console.error("Error fetching chart data:", error); // Loga erros no console
      }
    };

    // Função para gerar o PDF dos gráficos
    const generatePDF = async () => {
      try {
        const pdf = new jsPDF(); // Cria uma instância do jsPDF
        const chartContainer = document.querySelector('.charts-grid'); // Seleciona a área dos gráficos

        const canvas = await html2canvas(chartContainer); // Captura os gráficos como imagem
        const imageData = canvas.toDataURL('image/png'); // Converte para formato PNG

        pdf.addImage(imageData, 'PNG', 10, 10, 190, 240); // Adiciona a imagem no PDF
        pdf.save('charts-report.pdf'); // Salva o PDF com o nome especificado
      } catch (error) {
        console.error("Error generating PDF:", error); // Loga erros no console
      }
    };

    onMounted(fetchChartData); // Executa a busca dos dados ao montar o componente

    return {
      topRatedBooksData, // Dados reativos para o gráfico de livros mais bem avaliados
      genresData, // Dados reativos para o gráfico de gêneros
      authorsData, // Dados reativos para o gráfico de autores
      generatePDF, // Função para gerar PDF
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
  max-width: 24%;
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
  margin-top: 120px;
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