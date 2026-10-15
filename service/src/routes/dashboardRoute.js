/**
 * @file authRoutes.js
 * @description Rotas para autenticação de usuários, geração de token JWT e rota protegida do dashboard.
 */

const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Rota protegida acessível apenas por usuários autenticados
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado ao painel.
 *       401:
 *         description: Token ausente ou inválido.
 */
router.get("/", verifyToken, authController.getDashboard);

module.exports = router;
