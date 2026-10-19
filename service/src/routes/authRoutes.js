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
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Conta não encontrada.
 *       500:
 *         description: Erro interno ao consultar o perfil.
 */
router.get('/me', verifyToken, (req, res) =>
  authController.getProfile(req, res),
)

/**
 * @swagger
 * /auth/me:
 *   patch:
 *     summary: Atualiza o nome e o e-mail do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Nome ou e-mail inválido ou ausente.
 *       401:
 *         description: Token ausente ou inválido.
 *       409:
 *         description: E-mail já utilizado por outra conta.
 *       500:
 *         description: Erro interno ao atualizar o perfil.
 */
router.patch('/me', verifyToken, (req, res) =>
  authController.updateProfile(req, res),
)

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Exclui a conta do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Conta excluída com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Conta não encontrada.
 *       500:
 *         description: Erro interno ao excluir a conta.
 */
router.delete('/me', verifyToken, (req, res) =>
  authController.deleteAccount(req, res),
)

module.exports = router
