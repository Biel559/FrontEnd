<template>
    <!-- Contêiner principal das notificações -->
    <div class="notifications-container">
        <!-- Lista de notificações, exibida apenas se houver reservas -->
        <ul v-if="reservations.length > 0">
            <!-- Itera sobre as reservas para exibir cada item -->
            <li v-for="reservation in reservations" :key="reservation._id">
                <div class="reservation-item">
                    <!-- Exibe informações da reserva: título do livro e prazo para devolução -->
                    <p>
                        <strong>Book:</strong> {{ getBookTitle(reservation.bookId) }} <br />
                        <strong>Deadline:</strong> You have {{ daysLeft(reservation.reservedAt) }} days to return
                        ({{ returnDate(reservation.reservedAt) }})
                    </p>
                    <div class="divider"></div>
                </div>
            </li>
        </ul>
        <!-- Mensagem padrão caso não haja reservas -->
        <p v-else>No active reservations.</p>
    </div>
</template>

<script>
// Importa as APIs usadas para buscar informações de autenticação e livros
import apiAuth from "../axios";
import apiLibrary from "../services/api";

export default {
    data() {
        return {
            reservations: [], // Lista de reservas do usuário logado
            bookTitles: {}, // Cache de títulos dos livros para evitar múltiplas buscas
            showNotifications: false, // Controla a exibição do componente de notificações
        };
    },
    methods: {
        // Busca as reservas do usuário logado
        async fetchReservations() {
            console.log("Iniciando fetchReservations...");
            try {
                // Obtém o ID do usuário armazenado no localStorage
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("Usuário não encontrado no localStorage.");
                    return;
                }
                // Faz uma requisição à API para buscar as reservas do usuário
                const response = await apiAuth.get(`/auth/users/${userId}`);
                console.log("Resposta da API de reservas:", response.data);
                this.reservations = response.data.reservations || [];
                console.log("Reservas carregadas:", this.reservations);

                // Obtém os IDs dos livros relacionados às reservas
                const bookIds = this.reservations.map((reservation) => reservation.bookId);
                // Busca os títulos dos livros correspondentes
                await this.fetchBookTitles(bookIds);
            } catch (error) {
                console.error("Erro ao buscar reservas:", error);
            }
        },
        // Busca os títulos dos livros com base nos IDs fornecidos
        async fetchBookTitles(bookIds) {
            console.log("Buscando títulos para os IDs:", bookIds);
            try {
                // Faz uma requisição à API para buscar informações dos livros
                const response = await apiLibrary.getBooks();
                console.log("Livros recebidos:", response.data);
                const books = response.data;

                // Mapeia os IDs dos livros para seus títulos
                this.bookTitles = bookIds.reduce((acc, id) => {
                    const book = books.find((b) => b._id === id);
                    if (book) {
                        acc[id] = book.title;
                    } else {
                        console.warn(`Livro com ID ${id} não encontrado.`);
                    }
                    return acc;
                }, {});

                console.log("Mapeamento de títulos finalizado:", this.bookTitles);
            } catch (error) {
                console.error("Erro ao buscar títulos dos livros:", error);
            }
        },
        // Retorna o título de um livro com base no ID, ou uma mensagem padrão se não encontrado
        getBookTitle(bookId) {
            console.log("Obtendo título para o livro com ID:", bookId);
            return this.bookTitles[bookId] || "Título não encontrado";
        },
        // Calcula os dias restantes para devolução de um livro reservado
        daysLeft(reservedAt) {
            const reservedDate = new Date(reservedAt); // Data da reserva
            const dueDate = new Date(reservedDate); // Data limite para devolução
            dueDate.setDate(dueDate.getDate() + 14); // Adiciona 14 dias ao prazo

            const now = new Date(); // Data atual
            const timeDiff = dueDate - now; // Diferença em milissegundos
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Converte para dias
        },
        // Retorna a data de vencimento formatada para exibição
        returnDate(reservedAt) {
            const reservedDate = new Date(reservedAt); // Data da reserva
            reservedDate.setDate(reservedDate.getDate() + 14); // Adiciona 14 dias ao prazo
            return reservedDate.toLocaleDateString(); // Formata a data no padrão local
        },
        // Alterna a exibição do componente de notificações
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
            console.log("Notificações visíveis?", this.showNotifications);
        },
    },
    mounted() {
        // Chamado quando o componente é montado, inicializa as reservas
        console.log("Componente Notifications montado.");
        this.fetchReservations();
    },
    watch: {
        // Observa mudanças na variável `showNotifications` para atualizar as reservas
        showNotifications(newValue) {
            if (newValue) {
                console.log("Componente Notifications ativado.");
                this.fetchReservations();
            }
        },
    },
};
</script>

<style>
/* Importa a fonte Nunito */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');

/* Estilo do contêiner de notificações */
.notifications-container {
    font-family: 'Nunito', serif;
    position: absolute;
    top: 50px;
    right: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 4px solid rgb(0, 0, 0); /* Apenas para teste */
    z-index: 1100; /* Para garantir que esteja acima de outros elementos */
}

/* Remove estilos padrão da lista */
.notifications-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* Linha separadora entre notificações */
.divider {
    border-top: 4px solid #000000;
    border-radius: 20px;
}
</style>
