import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Crud from '../views/Crud.vue'; // Importa o componente App
import Cadastro from '@/views/Cadastro.vue';
import Book from '../views/Book.vue';
import Chart from '../views/Chart.vue';
import UserCrud from '@/views/UserCrud.vue';
import EditUser from '@/views/EditUser.vue'; // Importe o componente de edição
import Config from '@/views/Config.vue';

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
    path: '/edit-user/:userId', // Nova rota para edição de usuário
    name: 'EditUser',
    component: EditUser,
    meta: { requiresAuth: true, roles: ['librarian', 'admin'] }, // Restrição por role
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
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

  // Alteração do fundo do body com base na rota
  const routeBackground = {
    Login: '#651F71',
    Home: '#68B2F8',
    Cadastro: '#651F71',
    Crud: '#68B2F8',
    Book: '#68B2F8',
    Chart: '#68B2F8',
    UserCrud: '#68B2F8',
    EditUser: '#68B2F8', // Cor para a página de edição
    Config: '#68B2F8', // Cor para a página de edição
  };
  document.body.style.backgroundColor = routeBackground[to.name] || '';

  // Verifica autenticação
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    return next('/login');
  }

  // Verifica roles para rotas protegidas
  if (to.meta.roles && !to.meta.roles.includes(role)) {
    alert('Acesso negado! Você não tem permissão para acessar esta página.');
    return next('/home'); // Redireciona para a Home
  }

  next();
});

export default router;
