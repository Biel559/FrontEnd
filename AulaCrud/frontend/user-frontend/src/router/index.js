import { createRouter, createWebHistory } from 'vue-router'; 
import Login from '../views/Login.vue'; 
import Home from '../views/Home.vue'; 
import Crud from '../views/Crud.vue'; // Importa o componente App
import Cadastro from '@/views/Cadastro.vue';
import Book from '../views/Book.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/crud', // Nova rota para App.vue
    name: 'Crud',
    component: Crud,
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
  {
    path: '/book/:id',
    name: 'Book',
    component: Book,
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
  } else if (to.name === 'Home') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else if (to.name === 'Cadastro') {
    document.body.style.backgroundColor = '#651F71'; // Fundo para Dashboard 
  }
  else if (to.name === 'Crud') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else if (to.name === 'Book') {
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