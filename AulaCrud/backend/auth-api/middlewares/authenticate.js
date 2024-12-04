const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Adiciona os dados decodificados ao objeto `req`
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido ou expirado" });
    }
}

module.exports = authenticate;
