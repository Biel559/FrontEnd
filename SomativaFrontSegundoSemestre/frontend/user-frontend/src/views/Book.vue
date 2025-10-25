<template>
    <div class="book-page">
        <!-- Componente Navbar: Inclui a barra de navegação no topo, passando o método filterBooks por evento -->
        <Navbar @filterBooks="filterBooks" />
        <div class="content">
            <!-- Sidebar: Inclui a barra lateral para navegação -->
            <Sidebar />
            <!-- Detalhes do Livro -->
            <div class="book-details">
                <div class="book-box">
                    <!-- Exibe a imagem do livro -->
                    <div class="book-image">
                        <!-- Mostra a capa do livro se a propriedade "image" estiver disponível -->
                        <img :src="book.image || ''" alt="Capa do Livro" />
                    </div>
                    <div class="book-info">
                        <!-- Exibe o título do livro -->
                        <h1 class="book-title">{{ book.title }}</h1>
                        <div class="author-isbn">
                            <!-- Exibe o autor e o ISBN do livro -->
                            <p><strong>Author:</strong> {{ book.author }}</p>
                            <p><strong>ISBN:</strong> {{ book.isbn }}</p>
                        </div>
                        <!-- Exibe outras informações do livro -->
                        <p><strong>Publisher:</strong> {{ book.publisher }}</p>
                        <p><strong>Synopsis:</strong></p>
                        <p class="book-synopsis">{{ book.synopsis }}</p>
                        <p><strong>Year of publication:</strong> {{ book.year }}</p>

                        <!-- Seção de avaliação -->
                        <div class="rating-section">
                            <div class="stars">
                                <!-- Mostra as estrelas para avaliação -->
                                <span v-for="star in 5" :key="star" :class="getStarClass(star)"
                                    @mouseover="hoverStars(star)" @mouseleave="resetHover" @click="selectRating(star)">
                                    ★
                                </span>
                            </div>
                            <!-- Exibe a avaliação do livro -->
                            <p v-if="book.rating !== undefined && !isNaN(book.rating)">
                                Book rating: {{ book.rating.toFixed(1) }} stars ★ ({{ book.ratings.length }} reviews)
                            </p>
                            <p v-else>
                                Book rating: Not available
                            </p>

                            <!-- Mensagem destacando a avaliação feita pelo usuário -->
                            <p v-if="userRating > 0" class="highlight-message">
                                You are rating this book with {{ userRating }} star(s).
                            </p>

                            <!-- Botão para enviar a avaliação -->
                            <button class="rate-button" @click="submitRating">Rate</button>
                        </div>

                        <!-- Botão para reservar ou pegar emprestado o livro -->
                        <button class="reserve-button" @click="reserveBook">Borrow/Reserve</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script> 
// Importa os componentes e serviços necessários
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import apiLibrary from '../services/api'; // API para o backend da biblioteca
import apiAuth from '../axios'; // API para autenticação

export default {
    components: {
        Sidebar, // Componente da barra lateral
        Navbar,  // Componente da barra de navegação
    },
data() {
    return {
        book: {
            title: '',
            author: '',
            rating: 0,
            ratings: [],
        },
        userRating: 0,
        hoverRating: 0,
    };
},
    methods: {
        // Busca os detalhes do livro baseado no ID da rota
        async fetchBookDetails() {
            const bookId = this.$route.params.id; // Obtém o ID do livro da rota
            try {
                const response = await apiLibrary.getBooks(); // Faz uma requisição à API para obter os livros
                const book = response.data.find((b) => b._id === bookId); // Encontra o livro pelo ID
                if (book) {
                    // Atualiza os dados do livro no estado local
                    this.book = {
                        ...book,
                        rating: Number(book.rating) || 0, // Converte a avaliação para número
                    };
                    this.userRating = this.book.rating; // Define a nota do usuário com base no livro
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do livro:', error);
            }
        },
        // Define a classe das estrelas de acordo com o estado atual
        getStarClass(star) {
            if (this.book.rating >= star && this.userRating === 0) {
                return 'black-star'; // Estrela preta para a avaliação geral do livro
            }
            if (this.userRating >= star) {
                return 'blue-star'; // Estrela azul para a avaliação do usuário
            }
            if (this.hoverRating >= star) {
                return 'blue-hover'; // Estrela azul claro ao passar o mouse
            }
            return 'gray-star'; // Estrela cinza para estrelas não avaliadas
        },
        // Atualiza o estado ao passar o mouse sobre uma estrela
        hoverStars(star) {
            this.hoverRating = star;
        },
        // Reseta o estado de hover das estrelas
        resetHover() {
            this.hoverRating = 0;
        },
        // Define a avaliação do usuário ao clicar em uma estrela
        selectRating(star) {
            this.userRating = star;
        },
        // Envia a avaliação do usuário para o backend
        async submitRating() {
            try {
                const token = localStorage.getItem('token'); // Obtém o token de autenticação
                const response = await apiLibrary.rateBook(
                    this.book._id, 
                    { rating: this.userRating }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.book = response.data; // Atualiza os dados do livro
                this.userRating = 0; // Reseta a avaliação do usuário
                alert('Avaliação enviada com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error.response || error);
                alert('Erro ao enviar avaliação.');
            }
        },
        // Função para reservar ou pegar o livro emprestado
        async reserveBook() {
            const bookId = this.book._id; // Obtém o ID do livro
            const token = localStorage.getItem('token'); // Obtém o token de autenticação
            try {
                // Diminui a quantidade de livros no backend
                await apiLibrary.decreaseBookQuantity(bookId, 1);
                // Faz a reserva do livro na API de autenticação
                await apiAuth.post('/auth/reserve', { bookId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert(`Livro "${this.book.title}" reservado com sucesso!`);
            } catch (error) {
                console.error('Erro ao reservar livro:', error.response || error);
                // Tenta restaurar a quantidade em caso de erro
                try {
                    await apiLibrary.increaseBookQuantity(bookId, 1);
                } catch (restoreError) {
                    console.error('Erro ao restaurar quantidade:', restoreError.response || restoreError);
                }
                alert('Erro ao reservar o livro. Por favor, tente novamente.');
            }
        },
    },
    // Executado quando o componente é montado
    mounted() {
        console.log('Dados do livro:', this.book); // Exibe os dados do livro no console
        this.fetchBookDetails(); // Busca os detalhes do livro
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@700&family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.book-page {
    font-family: 'Inria Serif', serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    display: flex;
    margin-top: 70px;
    /* Espaço para a Navbar */
}

.author-isbn {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    /* Espaço entre autor e ISBN */
}

.author-isbn p {
    font-size: 1.3rem;
    /* Aumenta o tamanho da fonte */
}

.book-details {
    display: flex;
    justify-content: center;
    /* Centraliza horizontalmente */
    align-items: center;
    /* Centraliza verticalmente */
    padding: 20px;
    width: 100%;
    min-height: calc(100vh - 70px);
    /* Garante que ocupe o espaço visível, descontando a navbar */
    box-sizing: border-box;
    /* Inclui padding no tamanho total */
}


.book-box {
    display: flex;
    background-color: #6c63ff;
    color: #fff;
    margin-left: 300px;
    padding: 30px;
    /* Aumenta o padding */
    border-radius: 15px;
    box-shadow: 0px 8px 30px -5px rgba(0, 0, 0, 0.3);
    width: 70vw;
    /* Ajuste para 100% da largura da tela */
}

.book-image img {
    margin-top: 1.5vh;
    width: auto;
    /* Aumenta o tamanho da imagem */
    height: 800px;
    border-radius: 20px;
}

.book-info {
    margin-left: 100px;
    /* Aumenta a margem à esquerda */
    display: flex;
    flex-direction: column;
    max-width: 500px;
    /* Ajuste para permitir mais espaço para o texto */
}



.book-title {
    font-size: 2.5rem;
    /* Aumenta o tamanho da fonte */
    font-weight: bold;
}

.book-synopsis {
    margin: 15px 0;
    font-size: 1.2rem;
    /* Aumenta o tamanho da fonte */
    line-height: 1.8;
    /* Mais espaçamento entre linhas */
    white-space: normal;
    /* Permite a quebra de linha onde necessário */
    word-wrap: break-word;
    /* Garante que as palavras longas quebrem corretamente */
    max-width: 600px;
    /* Altere conforme necessário para o efeito desejado */
}

/* Estilo para as estrelas */
.stars {
    display: flex;
    font-size: 2rem;
    cursor: pointer;
}

.stars .blue-star {
    color: rgb(0, 0, 0);
    /* Azul para as estrelas do usuário */
}

.stars .black-star {
    color: rgb(0, 0, 0);
    /* Preto para as estrelas avaliadas pelo livro */
}

.stars .blue-hover {
    color: rgb(0, 140, 255);
    /* Azul claro ao passar o mouse */
}

.stars .gray-star {
    color: rgb(169, 169, 169);
    /* Cinza para as estrelas não avaliadas */
}

/* Estilos ao passar o mouse */
.stars .blue-star:hover,
.stars .black-star:hover {
    color: rgb(0, 140, 255);
    /* Azul quando passa o mouse */
}

/* Adicione um destaque para a mensagem */
.highlight-message {
    color: #000000;
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 10px;
}

.rate-button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #651F71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.rate-button:hover {
    background-color: #530F5A;
}

.reserve-button {
    font-family: 'Inika', serif;
    margin-top: 30px;
    padding: 15px 25px;
    /* Aumenta o botão */
    font-size: 1.2rem;
    /* Aumenta o texto do botão */
    background-color: #2A0D30;
    color: #fff;
    border: none;
    border-radius: 10px;
    /* Mais arredondado */
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.reserve-button:hover {
    background-color: #3A123F;
    /* Efeito no hover */
}
</style>