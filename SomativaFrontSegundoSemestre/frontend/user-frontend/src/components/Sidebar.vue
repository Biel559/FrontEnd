<template>
    <!-- Sidebar é o contêiner principal da barra lateral -->
    <div class="sidebar">
        
        <!-- Ícone inicial da Sidebar -->
        <div class="icon-section">
            <!-- A imagem do ícone principal é carregada a partir da pasta assets -->
            <img src="../assets/icons/main-icon.png" alt="Main Icon" class="main-icon" />
        </div>

        <!-- Seção de filtros: Aqui são apresentados os filtros de gêneros, autores e anos -->
        <div class="filter-section">
            
            <!-- Título da seção de Gêneros Literários -->
            <div class="filter-title">
                <h2>Literary Genres:</h2>
                <!-- Ícone relacionado aos gêneros literários -->
                <img src="../assets/icons/genre-icon.png" alt="Gêneros Icon" class="title-icon" />
            </div>
            <!-- Lista de gêneros literários, ao clicar em cada item, o evento 'filter' é emitido -->
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
  
            <!-- Seção de Filtros de Autores -->
            <div class="filter-section">
                <div class="filter-title">
                    <h2>Popular Authors:</h2>
                    <!-- Ícone relacionado aos autores -->
                    <img src="../assets/icons/author-icon.png" alt="Autores Icon" class="title-icon" />
                </div>
                <!-- Lista de autores populares, com evento de clique para filtro -->
                <ul class="filter-list">
                    <li @click="$emit('filter', { type: 'author', value: 'Sun Tzu' })">Sun Tzu</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Lewis Carroll' })">Lewis Carroll</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Bram Stoker' })">Bram Stoker</li>
                    <li @click="$emit('filter', { type: 'author', value: 'J.K. Rowling' })">J.K. Rowling</li>
                    <li @click="$emit('filter', { type: 'author', value: 'J.R.R. Tolkien' })">J.R.R. Tolkien</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Herman Melville' })">Herman Melville</li>
                    <li @click="$emit('filter', { type: 'author', value: 'L. Frank Baum' })">L. Frank Baum</li>
                    <li @click="$emit('filter', { type: 'author', value: 'Antoine De Saint-Exupéry' })">Antoine De Saint-Exupéry</li>
                </ul>
            </div>

            <!-- Seção de Filtros de Anos -->
            <div class="filter-section">
                <div class="filter-title">
                    <h2>Years:</h2>
                    <!-- Ícone relacionado aos anos -->
                    <img src="../assets/icons/year-icon.png" alt="Anos Icon" class="title-icon" />
                </div>
                <!-- Lista de faixas de anos, com evento de clique para filtro -->
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

            <!-- Ícone final da Sidebar -->
            <div class="footer-icon-section">
                <!-- Ícone na parte inferior da sidebar -->
                <img src="../assets/icons/footer-icon.png" alt="Footer Icon" class="footer-icon" />
            </div>
            <div class="footer-icon-section-hidden">
                <!-- Outro ícone (talvez para esconder) -->
                <img src="../assets/img/imagemvazia.png" alt="Footer Icon" class="footer-icon" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Importando a fonte externa 'Inika' do Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inika:wght@700&display=swap');

/* Estilo geral da Sidebar */
.sidebar {
    font-family: "Inika",serif; /* Usando a fonte importada */
    width: 250px; /* Largura fixa para a sidebar */
    background-color: #7037CD; /* Cor de fundo da sidebar */
    color: white; /* Cor do texto */
    height: 100%; /* A sidebar ocupa 100% da altura da tela */
    position: fixed; /* Fixa a sidebar à esquerda da tela */
    top: 70px; /* Coloca a sidebar abaixo da navbar (supondo que a navbar tem 70px de altura) */
    left: 0; /* Alinha a sidebar à esquerda */
    overflow-y: auto; /* Permite rolagem vertical caso o conteúdo seja maior que a altura da tela */
    padding: 20px; /* Espaçamento interno */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Sombras para dar um efeito de profundidade */
}

/* Estilo para o ícone principal */
.main-icon {
    margin-top: 10px;
    margin-left: 10px;
    height: 150px;
    width: 200px;
}

/* Seção de filtro (gêneros, autores, anos) */
.filter-section {
    margin-bottom: 20px;
}

/* Título da seção de filtro */
.filter-title {
    display: flex; /* Usando flexbox para alinhar o título e o ícone */
    align-items: center; /* Alinha verticalmente os itens */
    justify-content: space-between; /* Espaço entre o título e o ícone */
    margin-bottom: 10px;
    text-decoration: underline; /* Sublinha o título */
}

/* Lista de itens de filtro */
.filter-list {
    list-style: none; /* Remove os marcadores da lista */
    padding: 0; /* Remove o padding da lista */
}

/* Estilo dos itens da lista (os filtros) */
.filter-list li {
    padding: 5px 0; /* Espaçamento interno nos itens da lista */
    cursor: pointer; /* Aponta o cursor como se fosse um link */
}

/* Estilo do ícone do rodapé */
.footer-icon {
    width: 150px; /* Define a largura do ícone */
    height: 150px; /* Define a altura do ícone */
    display: block; /* Faz o ícone ser exibido como bloco */
    margin: 0 auto; /* Centraliza o ícone horizontalmente */
    margin-top: 40px; /* Espaço superior do ícone */
}

/* Seção oculta do rodapé */
.footer-icon-section-hidden{
    margin-top: -60px; /* Move a seção oculta para cima */
}
</style>
