import { createRouter, createWebHistory } from 'vue-router'; 
import Login from '../views/Login.vue'; 
import Dashboard from '../views/Dashboard.vue'; 
import App from '../views/App.vue'; // Importa o componente App
import Cadastro from '@/views/Cadastro.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/app', // Nova rota para App.vue
    name: 'App',
    component: App,
  },
  {
    path: '/cadastro', // Nova rota para Cadastro.vue
    name: 'Cadastro',
    component: Cadastro,
  },
  {
    path: '/:catchAll(.*)', // Usando a nova sintaxe para rotas coringa
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Proteção das rotas e alteração do estilo do body
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  // Alterar o fundo do body com base na rota
  if (to.name === 'Login') {
    document.body.style.backgroundColor = '#651F71'; // Fundo para Login
  } else if (to.name === 'Dashboard') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else if (to.name === 'Cadastro') {
    document.body.style.backgroundColor = '#651F71'; // Fundo para Dashboard 
  }
  else if (to.name === 'App') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else {
    document.body.style.backgroundColor = ''; // Reseta para o padrão
  }

  // Verifica autenticação para rotas protegidas
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;