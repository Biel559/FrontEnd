const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Inicialização do app
const app = express();
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
mongoose
  .connect(
    "mongodb+srv://biel559cr:gV0qyQD3WvOCWNmJ@clustergabriel559.b0eqt.mongodb.net/library",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Importação das rotas
const booksRoutes = require("./routes/book");
app.use("/api/books", booksRoutes);

// Definir a porta do servidor
app.listen(4000, () => {
  console.log("Servidor rodando na porta 3000");
});
