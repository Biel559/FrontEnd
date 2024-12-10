import axios from 'axios'; // Importa Axios para requisições HTTP
 
// URL base da API
const BASE_URL = 'http://localhost:3000/api/books';

// Funções CRUD usando Axios
export default {
  // GET: Obter a lista de livros
  getBooks() {
    return axios.get(BASE_URL);
  },

  // POST: Adicionar um novo livro
  addBook(book) {
    return axios.post(BASE_URL, book, {
      headers: {
        'Content-Type': 'multipart/form-data', // Permite envio de arquivos
      },
    });
  },

  // PUT: Atualizar um livro existente
  updateBook(id, book) {
    return axios.put(`${BASE_URL}/${id}`, book, {
      headers: {
        'Content-Type': 'multipart/form-data', // Permite envio de arquivos
      },
    });
  },

  // PUT: Diminuir a quantidade de um livro
  decreaseBookQuantity(id, decreaseBy) {
    return axios.put(`${BASE_URL}/${id}/decrease-quantity`, { decreaseBy });
  },

  // PUT: Aumentar a quantidade de um livro
  increaseBookQuantity(id, increaseBy) {
    return axios.put(`${BASE_URL}/${id}/increase-quantity`, { increaseBy });
  },

  // DELETE: Remover um livro pelo ID
  deleteBook(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  },

  // PUT: Avaliar um livro
  rateBook(id, ratingData) {
    const token = localStorage.getItem('token'); // Pega o token armazenado no localStorage
  
    return axios.put(`${BASE_URL}/${id}/rate`, ratingData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
      },
    });
  },  

  // PUT: Atualizar a quantidade de um livro
  updateBookQuantity(id, data) {
    return axios.put(`${BASE_URL}/${id}/quantity`, data);
  },

  // GET: Obter dados para os gráficos
  getChartData() {
    return axios.get(`${BASE_URL}/charts-data`);
  },
};