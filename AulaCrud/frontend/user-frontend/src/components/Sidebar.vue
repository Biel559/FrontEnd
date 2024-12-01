<template>
    <div class="sidebar">
        <!-- Ícone inicial -->
        <div class="icon-section">
            <img src="../assets/icons/main-icon.png" alt="Main Icon" class="main-icon" />
        </div>

        <!-- Conteúdo da Sidebar -->
        <div class="filter-section">
            <div class="filter-title">
                <h2>Literary Genres:</h2>
                <img src="../assets/icons/genre-icon.png" alt="Gêneros Icon" class="title-icon" />
            </div>
            <ul class="filter-list">
                <li @click="$emit('filter', { type: 'genre', value: 'Fiction' })">Fiction</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Drama' })">Drama</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Fable' })">Fable</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Poetry' })">Poetry</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Children Books' })">Children Books</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Science' })">Science</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Business & Economics' })">Business & Economics</li>
                <li @click="$emit('filter', { type: 'genre', value: 'Philosophy' })">Philosophy</li>
            </ul>
  
            <!-- Autores -->
            <div class="filter-section">
                <div class="filter-title">
                    <h2>Popular Authors:</h2>
                    <img src="../assets/icons/author-icon.png" alt="Autores Icon" class="title-icon" />
                </div>
                <ul class="filter-list">
                    <li @click="$emit('filter', { type: 'author', value: 'Sun Tsu' })">Sun Tsu</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Lewis Carroll' })">Lewis Carroll</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Bram Stoker' })">Bram Stoker</li>
                    <li @click="$emit('filter', { type: 'author', value: 'J.K. Rowling' })">J.K. Rowling</li>
                    <li @click="$emit('filter', { type: 'author', value: 'J.R.R. Tolkien' })">J.R.R. Tolkien</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Herman Melville' })">Herman Melville</li>
                    <li @click="$emit('filter', { type: 'author', value: 'L. Frank Baum' })">L. Frank Baum</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Antoine De Saint-Exupéry' })">Antoine De Saint-Exupéry</li>
                </ul>
            </div>

            <!-- Anos -->
            <div class="filter-section">
                <div class="filter-title">
                    <h2>Years:</h2>
                    <img src="../assets/icons/year-icon.png" alt="Anos Icon" class="title-icon" />
                </div>
                <ul class="filter-list">
                    <li @click="$emit('filter', { type: 'year', value: 2000 })">2000+</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1980, 1999] })">1980 - 1999</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1960, 1979] })">1960 - 1979</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1930, 1959] })">1930 - 1959</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1900, 1929] })">1900 - 1929</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1800, 1899] })">1800 - 1899</li>
                    <li @click="$emit('filter', { type: 'year-range', value: [1500, 1799] })">1500 - 1799</li>
                    <li @click="$emit('filter', { type: 'year-below', value: 1499 })">1499 -</li>
                </ul>
            </div>

            <!-- Ícone final -->
            <div class="footer-icon-section">
                <img src="../assets/icons/footer-icon.png" alt="Footer Icon" class="footer-icon" />
            </div>
            <div class="footer-icon-section-hidden">
                <img src="../assets/img/imagemvazia.png" alt="Footer Icon" class="footer-icon" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@700&display=swap');
.sidebar {
    font-family: "Inika",serif;
    width: 250px;
    background-color: #7037CD;
    color: white;
    height: 100%;
    /* Ocupa toda a altura do container */
    position: fixed;
    top: 70px;
    /* Alinha abaixo da navbar */
    left: 0;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.main-icon {
    margin-top: 10px;
    margin-left: 10px;
    height: 150px;
    width: 200px;
}

.filter-section {
    margin-bottom: 20px;
}

.filter-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    text-decoration: underline;
}

.filter-list {
    list-style: none;
    padding: 0;
}

.filter-list li {
    padding: 5px 0;
    cursor: pointer;
}

.footer-icon {
    width: 150px; /* Diminui a largura */
    height: 150px; /* Diminui a altura */
    display: block;
    margin: 0 auto; /* Centraliza horizontalmente */
    margin-top: 40px; /* Espaço superior */
}
.footer-icon-section-hidden{
    margin-top: -60px;
}
</style>