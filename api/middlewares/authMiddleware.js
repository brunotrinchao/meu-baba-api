const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Arquivo onde está a configuração do token

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido" });
  }

  try {
    // Remove "Bearer " se estiver presente no header
    const tokenValue = token.replace("Bearer ", "");
    
    // Verifica se o token é o mesmo que está no .env
    if (tokenValue !== config.jwtSecret) {
      return res.status(401).json({ error: "Token inválido" });
    }

    next(); // Permite o acesso à rota
  } catch (error) {
    return res.status(401).json({ error: "Erro ao validar o token" });
  }
};

module.exports = verifyToken;
