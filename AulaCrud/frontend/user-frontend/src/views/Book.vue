<template>
    <div class="book-page">
        <nav class="navbar">
            <div class="logo">
                <a href=""><img src="../assets/dashboardImg/logoIllumine.png" alt="Logo" @click="goToHome" /></a>
            </div>
            <div class="InputContainer">
                <input placeholder="Search for a book..." id="input" class="input" name="text" type="text"
                    v-model="searchQuery" @input="filterBooks" />

                <label class="labelforsearch" for="input">
                    <svg class="searchIcon" viewBox="0 0 512 512">
                        <path
                            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
                        </path>
                    </svg>
                </label>
            </div>
            <div class="nav-icons">
                <a href="#crud" class="icon"><img src="../assets/dashboardImg/crud.png" alt="" @click="goToApp" /></a>
                <a href="#graficos" class="icon"><img src="../assets/dashboardImg/chart.png" alt="" /></a>
                <a href="#notificacoes" class="icon"><img src="../assets/dashboardImg/notification.png" alt="" /></a>
                <a href="#configuracoes" class="icon"><img src="../assets/dashboardImg/config.png" alt="" /></a>
            </div>
        </nav>


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
                        <button class="reserve-button" @click="reserveBook">Borrow/Reserve</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
    components: {
        Sidebar,
    },
    data() {
        return {
            book: this.$route.query, // Obtém os dados do livro da query string
            baseURL: 'http://localhost:3000', // URL base do backend
        };
    },
    methods: {
        async fetchBookDetails() {
            const bookId = this.$route.params.id; // Obtém o ID do livro da rota
            try {
                const response = await this.$http.get(`/books/${bookId}`); // Altere o endpoint para o correto
                this.book = response.data; // Atualiza os detalhes do livro
            } catch (error) {
                console.error('Erro ao buscar detalhes do livro:', error);
            }
        },

        reserveBook() {
            console.log(`Livro reservado: ${this.book.title}`);
            // Aqui você pode adicionar lógica para a reserva/emprestimo
        },

        goToApp() {
      this.$router.push('/crud'); // Redireciona para a nova rota
    },
    goToHome() {
      this.$router.push('/home'); // Redireciona para a nova rota
    },
    },
    mounted() {
        this.fetchBookDetails(); // Carrega os dados do livro ao montar o componente
    },
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

.navbar {
    display: flex;
    align-items: center;
    background-color: #651F71;
    padding: 10px;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /* Garante que ocupe toda a largura */
    z-index: 1000;
    box-sizing: border-box;
    /* Inclui padding dentro do tamanho total */
}


.search-bar {
    flex-grow: 1;
    /* Faz a barra de busca ocupar o espaço restante */
    display: flex;
    /* Para centralizar o input */
    justify-content: center;
    /* Centraliza o input */
}

.search-bar input {
    max-width: 400px;
    /* Aumente a largura máxima do input */
    width: 100%;
    /* Faz o input ocupar 100% do espaço disponível */
    padding: 12px;
    /* Aumenta o padding para um tamanho maior */
    border: none;
    border-radius: 4px;
}



.logo img {
    height: 80px;
    /* Ajuste conforme necessário */
    margin-right: 20px;
}

.InputContainer {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    padding-left: 15px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
}

.input {
    width: 570px;
    height: 100%;
    border: none;
    outline: none;
    font-size: 0.9em;
    caret-color: rgb(255, 81, 0);
}

.labelforsearch {
    cursor: text;
    padding: 0px 12px;
}

.searchIcon {
    width: 13px;
}

.border {
    height: 40%;
    width: 1.3px;
    background-color: rgb(223, 223, 223);
}

.micIcon {
    width: 12px;
}

.micButton {
    padding: 0px 15px 0px 12px;
    border: none;
    background-color: transparent;
    height: 40px;
    cursor: pointer;
    transition-duration: 0.3s;
}

.searchIcon path {
    fill: rgb(114, 114, 114);
}

.micIcon path {
    fill: rgb(255, 81, 0);
}

.micButton:hover {
    background-color: rgb(255, 230, 230);
    transition-duration: 0.3s;
}


.nav-icons {
    display: flex;
    -right: 70px;
    /* Adiciona espaço à esquerda dos ícones */
}

.nav-icons .icon {
    color: white;
    text-decoration: none;
    margin-left: 45px;
    /* Reduz a margem entre os ícones */
    font-size: 20px;
    /* Ajuste conforme necessário */
    transition: color 0.3s;
}

.nav-icons img {
    width: 64px;
    /* Ajuste conforme necessário */
    height: 64px;
    /* Ajuste conforme necessário */
}

.content {
    display: flex;
    margin-top: 70px;
    /* Espaço para a Navbar */
}

.author-isbn {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Espaço entre autor e ISBN */
}

.author-isbn p {
    font-size: 1.3rem; /* Aumenta o tamanho da fonte */
}

.book-details {
    display: flex;
    justify-content: center; /* Centraliza horizontalmente */
    align-items: center;    /* Centraliza verticalmente */
    padding: 20px;
    width: 100%;
    min-height: calc(100vh - 70px); /* Garante que ocupe o espaço visível, descontando a navbar */
    box-sizing: border-box; /* Inclui padding no tamanho total */
}


.book-box {
    display: flex;
    background-color: #6c63ff;
    color: #fff;
    margin-left: 300px;
    padding: 30px; /* Aumenta o padding */
    border-radius: 15px;
    box-shadow: 0px 8px 30px -5px rgba(0, 0, 0, 0.3);
    width: 70vw; /* Ajuste para 100% da largura da tela */
}
.book-image img {
    margin-top: 3vh;
    width: 350px;
    /* Aumenta o tamanho da imagem */
    height: auto;
    border-radius: 20px;
}

.book-info {
    margin-left: 100px; /* Aumenta a margem à esquerda */
    display: flex;
    flex-direction: column;
    max-width: 500px; /* Ajuste para permitir mais espaço para o texto */
}



.book-title {
    font-size: 2.5rem; /* Aumenta o tamanho da fonte */
    font-weight: bold;
}
.book-synopsis {
    margin: 15px 0;
    font-size: 1.2rem; /* Aumenta o tamanho da fonte */
    line-height: 1.8; /* Mais espaçamento entre linhas */
    white-space: normal; /* Permite a quebra de linha onde necessário */
    word-wrap: break-word; /* Garante que as palavras longas quebrem corretamente */
    max-width: 600px; /* Altere conforme necessário para o efeito desejado */
}

.reserve-button {
    font-family: 'Inika', serif;
    margin-top: 30px;
    padding: 15px 25px; /* Aumenta o botão */
    font-size: 1.2rem; /* Aumenta o texto do botão */
    background-color: #2A0D30;
    color: #fff;
    border: none;
    border-radius: 10px; /* Mais arredondado */
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.reserve-button:hover {
    background-color: #3A123F; /* Efeito no hover */
}
</style>