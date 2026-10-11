/**
 * @file authMiddleware.js
 * @description Middleware para validação de JWT e controle de acesso baseado em papéis (RBAC).
 */
const jwt = require("jsonwebtoken");

/**
 * Verifica se o usuário possui um token JWT válido.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ error: "Erro no formato do token." });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: "Token mal formatado." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Token inválido ou expirado." });

    req.user = decoded;
    return next();
  });
}

/**
 * Restringe o acesso apenas a usuários com o papel (role) de administrador.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Requer privilégios de administrador." });
  }
  return next();
}

module.exports = {
  verifyToken,
  requireAdmin,
};
