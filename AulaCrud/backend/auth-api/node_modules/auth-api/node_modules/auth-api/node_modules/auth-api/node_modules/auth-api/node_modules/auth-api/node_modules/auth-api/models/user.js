const mongoose = require('mongoose');

// Define o esquema de usuário

const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true }, // Nome de usuário obrigatório e único
password: { type: String, required: true }, // Senha obrigatória
})

// Exporta o modelo de usuário

module.exports = mongoose.model('User', userSchema);
 