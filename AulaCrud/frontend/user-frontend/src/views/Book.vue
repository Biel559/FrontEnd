<template>
    <div class="book-page">
        <Navbar @filterBooks="filterBooks" />
        <div class="content">
            <!-- Sidebar -->
            <Sidebar />
            <!-- Detalhes do Livro -->
            <div class="book-details">
                <div class="book-box">
                    <div class="book-image">
                        <img :src="book.image ? `${baseURL}${book.image}` : ''" alt="Capa do Livro" />
                    </div>
                    <div class="book-info">
                        <h1 class="book-title">{{ book.title }}</h1>
                        <div class="author-isbn">
                            <p><strong>Author:</strong> {{ book.author }}</p>
                            <p><strong>ISBN:</strong> {{ book.isbn }}</p>
                        </div>
                        <p><strong>Publisher:</strong> {{ book.publisher }}</p>
                        <p><strong>Synopsis:</strong></p>
                        <p class="book-synopsis">{{ book.synopsis }}</p>
                        <p><strong>Year of publication:</strong> {{ book.year }}</p>

                        <!-- Avaliação -->
                        <div class="rating-section">
                            <div class="stars">
                                <span v-for="star in 5" :key="star" :class="getStarClass(star)"
                                    @mouseover="hoverStars(star)" @mouseleave="resetHover" @click="selectRating(star)">
                                    ★
                                </span>
                            </div>
                            <p v-if="book.rating !== undefined && !isNaN(book.rating)">
                                Book rating: {{ book.rating.toFixed(1) }} stars ★ ({{ book.ratings.length }} reviews)
                            </p>
                            <p v-else>
                                Book rating: Not available
                            </p>

                            <p v-if="userRating > 0" class="highlight-message">You are rating this book with {{
                                userRating }} star(s).</p>
                            <p v-else class="highlight-message"></p>

                            <!-- Nova linha para mostrar a avaliação -->

                            <button class="rate-button" @click="submitRating">Rate</button>
                        </div>

                        <button class="reserve-button" @click="reserveBook">Borrow/Reserve</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script> 
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import apiLibrary from '../services/api'; // Importa API do library-backend
import apiAuth from '../axios'; // Importa API do auth-api

export default {
    components: {
        Sidebar,
        Navbar,
    },
    data() {
        return {
            book: {
                title: '',
                author: '',
                rating: 0, // Valor padrão como número
                ratings: [],
            },
            baseURL: 'http://localhost:3000', // URL base do backend
            userRating: 0, // Nota que o usuário selecionou
            hoverRating: 0, // Nota exibida ao passar o mouse
        };
    },

    methods: {
        async fetchBookDetails() {
            const bookId = this.$route.params.id;
            try {
                const response = await apiLibrary.getBooks();
                const book = response.data.find((b) => b._id === bookId);
                if (book) {
                    this.book = {
                        ...book,
                        rating: Number(book.rating) || 0,
                    };
                    this.userRating = this.book.rating; // Atualiza a avaliação do usuário
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do livro:', error);
            }
        }
        ,
        getStarClass(star) {
            // Estrelas do livro (preta)
            if (this.book.rating >= star && this.userRating === 0) {
                return 'black-star'; // Estrela preta para avaliação do livro
            }
            // Estrelas avaliadas pelo usuário (azul)
            if (this.userRating >= star) {
                return 'blue-star'; // Estrela azul para avaliação do usuário
            }
            // Estrelas do mouse hover (azul claro)
            if (this.hoverRating >= star) {
                return 'blue-hover'; // Estrela azul ao passar o mouse
            }
            // Estrelas restantes (cinza)
            return 'gray-star'; // Estrela cinza para estrelas não avaliadas
        },

        hoverStars(star) {
            this.hoverRating = star;
        },
        resetHover() {
            this.hoverRating = 0;
        },
        selectRating(star) {
            this.userRating = star; // Atualiza o rating do usuário
        },


        async submitRating() {
            try {
                const token = localStorage.getItem('token');
                console.log('Token enviado:', token); // Verifique se o token está correto

                const response = await apiLibrary.rateBook(this.book._id, {
                    rating: this.userRating,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                this.book = response.data; // Atualiza os dados do livro com a nova avaliação
                this.userRating = 0; // Reseta a seleção de avaliação
                alert('Avaliação enviada com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error.response || error);
                alert('Erro ao enviar avaliação.');
            }

        },

        async reserveBook() {
    const bookId = this.book._id;
    const token = localStorage.getItem('token'); // Recupera o token de autenticação

    try {
        // Reduzir a quantidade do livro no library-backend
        const decreaseResponse = await apiLibrary.decreaseBookQuantity(bookId, 1);
        console.log('Quantidade reduzida com sucesso:', decreaseResponse.data);

        // Reservar o livro no auth-api
        const reserveResponse = await apiAuth.post('/auth/reserve',
            { bookId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Livro reservado com sucesso:', reserveResponse.data);
        alert(`Livro "${this.book.title}" reservado com sucesso!`);
    } catch (error) {
        console.error('Erro ao reservar livro:', error.response || error);

        // Em caso de falha na reserva, aumenta a quantidade novamente no library-backend
        try {
            const increaseResponse = await apiLibrary.increaseBookQuantity(bookId, 1);
            console.log('Quantidade restaurada após falha:', increaseResponse.data);
        } catch (restoreError) {
            console.error('Erro ao restaurar quantidade:', restoreError.response || restoreError);
        }

        alert('Erro ao reservar o livro. Por favor, tente novamente.');
    }
}


    },
    mounted() {
        console.log('Dados do livro:', this.book);
        this.fetchBookDetails();
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