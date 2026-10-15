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
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido com retorno do token.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
