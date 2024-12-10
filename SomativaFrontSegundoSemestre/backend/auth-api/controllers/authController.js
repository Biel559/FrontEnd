const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Importa bcrypt para hash de senhas
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para criar tokens JWT

// Função para registrar novos usuários
exports.register = async (req, res) => {
    const { username, password, role, matriculationId, course, semester } = req.body;

    try {
        // Criptografa a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificação para campos obrigatórios se o usuário for estudante
        if (role === 'student') {
            if (!matriculationId || !course || !semester) {
                return res.status(400).json({ error: 'Matriculation ID, Course, and Semester are required for students.' });
            }
        }

        // Cria um novo usuário com os dados fornecidos
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'student',  // Caso não tenha role, o padrão é 'student'
            matriculationId,
            course,
            semester
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error(error);  // Log de erro no console do servidor
        res.status(500).json({ error: `Erro ao registrar usuário: ${error.message}` }); // Mensagem de erro
    }
};

// Função para fazer login de usuários
exports.login = async (req, res) => {
    const { username, password } = req.body; // Pega dados do corpo da requisição

    try {
        // Busca o usuário pelo nome de usuário
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' }); // Retorna erro
        }

        // Verifica se o usuário está ativo
        if (!user.isActive) {
            return res.status(403).json({ error: 'Conta desativada. Entre em contato com a secretaria.' });
        }

        // Compara a senha fornecida com a senha armazenada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta' }); // Retorna erro se a senha não corresponder
        }

        // Cria o token JWT para autenticação
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Inclui o role no token
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Responde com o token e os dados do usuário
        res.json({
            token,         // Token JWT
            userId: user._id, // ID do usuário
            role: user.role,  // Role do usuário
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' }); // Responde com erro ao fazer login
    }
};