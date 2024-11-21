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

  // DELETE: Remover um livro pelo ID
  deleteBook(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  },
};
