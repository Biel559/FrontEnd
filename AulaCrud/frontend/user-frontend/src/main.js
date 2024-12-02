import { createApp } from 'vue'; // Importação para Vue 3
import App from './App.vue'; // Componente raiz
import './assets/dashboard.css'; // CSS global
import router from './router'; // Configuração de rotas
import api from './axios'; // Instância Axios personalizada
import { Chart as ChartJS, registerables } from 'chart.js';

// Registrar todos os componentes necessários para os gráficos
ChartJS.register(...registerables);

const app = createApp(App); // Cria a instância do aplicativo

// Configura o Axios como uma propriedade global
app.config.globalProperties.$http = api;

// Usa o Vue Router para gerenciar as rotas
app.use(router);

// Monta o aplicativo no elemento #app do DOM
app.mount('#app');