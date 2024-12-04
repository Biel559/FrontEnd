import { createRouter, createWebHistory } from 'vue-router'; 
import Login from '../views/Login.vue'; 
import Home from '../views/Home.vue'; 
import Crud from '../views/Crud.vue'; // Importa o componente App
import Cadastro from '@/views/Cadastro.vue';
import Book from '../views/Book.vue'
import Chart from '../views/Chart.vue'
import UserCrud from '@/views/UserCrud.vue';

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
    path: '/crud',
    name: 'Crud',
    component: Crud,
    meta: { requiresAuth: true, roles: ['librarian', 'admin'] }, // Restrição por role
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Chart,
    meta: { requiresAuth: true, roles: ['librarian'] }, // Exclusivo para Librarian
  },  
  {
    path: '/book/:id',
    name: 'Book',
    component: Book,
  },  
  {
    path: '/userCrud',
    name: 'UserCrud',
    component: UserCrud,
    meta: { requiresAuth: true, roles: ['librarian', 'admin'] }, // Restrição por role
  },  
  {
    path: '/:catchAll(.*)',
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
  const role = localStorage.getItem('role') || 'student';

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
  else if (to.name === 'Chart') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else if (to.name === 'UserCrud') {
    document.body.style.backgroundColor = '#68B2F8'; // Fundo para Dashboard
  }
  else {
    document.body.style.backgroundColor = ''; // Reseta para o padrão
  }

// Verifica autenticação
if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
  next('/login');
  return;
}

// Verifica roles para rotas protegidas
if (to.meta.roles && !to.meta.roles.includes(role)) {
  alert('Acesso negado! Você não tem permissão para acessar esta página.');
  next('/home'); // Redireciona para a Home
  return;
}

next();
});

export default router;