/**
 * @file authRoutes.js
 * @description Rotas para autenticação de usuários, geração de token JWT e rota protegida do dashboard.
 */

const {Router} = require('express')
const {verifyToken} = require('../middlewares/authMiddleware')
const authController = require('../controllers/authController')

const router = Router()

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
router.post('/login', (req, res) => authController.login(req, res))

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria uma conta de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Conta criada e usuário autenticado.
 *       400:
 *         description: Dados inválidos ou obrigatórios ausentes.
 *       409:
 *         description: Já existe uma conta com este e-mail.
 */
router.post('/register', (req, res) => authController.register(req, res))

router.get('/me', verifyToken, (req, res) =>
  authController.getProfile(req, res),
)
router.patch('/me', verifyToken, (req, res) =>
  authController.updateProfile(req, res),
)
router.delete('/me', verifyToken, (req, res) =>
  authController.deleteAccount(req, res),
)

module.exports = router
