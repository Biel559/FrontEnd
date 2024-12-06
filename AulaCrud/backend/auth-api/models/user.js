const mongoose = require('mongoose');

// Define o esquema de usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Nome de usuário obrigatório e único
  password: { type: String, required: true }, // Senha obrigatória
  role: { type: String, default: 'student', enum: ['student', 'admin', 'librarian'] }, // Role do usuário
  matriculationId: {
    type: String,
    validate: {
      validator: function (value) {
        // Só é obrigatório se a role for 'student'
        return this.role !== 'student' || (value && value.trim().length > 0);
      },
      message: 'Matriculation ID is required for students.'
    }
  },
  course: {
    type: String,
    validate: {
      validator: function (value) {
        return this.role !== 'student' || (value && value.trim().length > 0);
      },
      message: 'Course is required for students.'
    }
  },
  semester: {
    type: Number,
    validate: {
      validator: function (value) {
        return this.role !== 'student' || (value && value > 0);
      },
      message: 'Semester is required for students and must be greater than 0.'
    }
  },
  reservations: {
    type: [{ bookId: mongoose.Schema.Types.ObjectId, reservedAt: Date }], // Livros reservados
    default: []
  },
  reservationLimit: { type: Number, default: 3 }, // Limite de reservas
  isActive: { type: Boolean, default: true }, // Indica se a conta está ativa ou desativada
}, {
  timestamps: true // Adiciona 'createdAt' e 'updatedAt' automaticamente
});

userSchema.pre('save', function (next) {
  if (this.role === 'student') {
    // Valida somente na criação ou alteração dos campos dependentes
    if (this.isNew || this.isModified('matriculationId') || this.isModified('course') || this.isModified('semester')) {
      if (!this.matriculationId || !this.course || !this.semester) {
        const err = new Error('Matriculation ID, Course, and Semester are required for students.');
        return next(err);
      }
    }
  }
  next();
});

// Exporta o modelo de usuário
module.exports = mongoose.model('User', userSchema);
