import { createApp } from 'vue'; // Importação para Vue 3
import App from './App.vue';
import router from './router';
import api from './axios'; // Importa a configuração do Axios

const app = createApp(App); // Cria a instância do aplicativo

app.config.globalProperties.$http = api; // Adiciona o Axios como uma propriedade global

app.use(router); // Usa o Vue Router

app.mount('#app'); // Monta o aplicativo no elemento #app
