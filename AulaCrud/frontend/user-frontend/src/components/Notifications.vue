<template>
    <div class="notifications-container">
        <ul v-if="reservations.length > 0">
            <li v-for="reservation in reservations" :key="reservation._id">
                <div class="reservation-item">
                    <p>
                        <strong>Book:</strong> {{ getBookTitle(reservation.bookId) }} <br />
                        <strong>Deadline:</strong> You have {{ daysLeft(reservation.reservedAt) }} days to return
                        ({{ returnDate(reservation.reservedAt) }})
                    </p>
                    <div class="divider"></div>
                </div>
            </li>
        </ul>
        <p v-else>No active reservations.</p>
    </div>
</template>

<script>
import apiAuth from "../axios";
import apiLibrary from "../services/api";

export default {
    data() {
        return {
            reservations: [], // Lista de reservas do usuário logado
            bookTitles: {}, // Cache de títulos dos livros
            showNotifications: false, // Controla exibição do componente
        };
    },
    methods: {
        async fetchReservations() {
            console.log("Iniciando fetchReservations...");
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    console.error("Usuário não encontrado no localStorage.");
                    return;
                }
                const response = await apiAuth.get(`/auth/users/${userId}`);
                console.log("Resposta da API de reservas:", response.data);
                this.reservations = response.data.reservations || [];
                console.log("Reservas carregadas:", this.reservations);

                const bookIds = this.reservations.map((reservation) => reservation.bookId);
                await this.fetchBookTitles(bookIds);
            } catch (error) {
                console.error("Erro ao buscar reservas:", error);
            }
        },
        async fetchBookTitles(bookIds) {
            console.log("Buscando títulos para os IDs:", bookIds);
            try {
                const response = await apiLibrary.getBooks();
                console.log("Livros recebidos:", response.data);
                const books = response.data;

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
        getBookTitle(bookId) {
            console.log("Obtendo título para o livro com ID:", bookId);
            return this.bookTitles[bookId] || "Título não encontrado";
        },

        daysLeft(reservedAt) {
            // Calcula os dias restantes até o vencimento
            const reservedDate = new Date(reservedAt);
            const dueDate = new Date(reservedDate);
            dueDate.setDate(dueDate.getDate() + 14);

            const now = new Date();
            const timeDiff = dueDate - now;
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Converte ms para dias
        },
        returnDate(reservedAt) {
            // Calcula a data de vencimento
            const reservedDate = new Date(reservedAt);
            reservedDate.setDate(reservedDate.getDate() + 14);
            return reservedDate.toLocaleDateString(); // Formata a data no padrão local
        },
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
            console.log("Notificações visíveis?", this.showNotifications);
        },
    },
    mounted() {
        console.log("Componente Notifications montado.");
        this.fetchReservations();
    },
    watch: {
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap');
.notifications-container {
    font-family: 'Nunito',serif;
    position: absolute;
    top: 50px;
    right: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 4px solid rgb(0, 0, 0);
    /* Para teste */
    z-index: 1100;
    /* Aumente para ficar acima da Navbar */
}

.notifications-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.notifications-container li {
}

.divider {
    border-top: 4px solid #000000;
    border-radius: 20px
}

</style>