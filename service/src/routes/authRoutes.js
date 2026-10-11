/**
 * @file authRoutes.js
 * @description Rotas de autenticação da API.
 */
const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza a autenticação do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@ifrs.edu.br
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso. Retorna o token JWT.
 *       400:
 *         description: E-mail ou senha ausentes.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
