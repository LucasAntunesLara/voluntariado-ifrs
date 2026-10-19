/**
 * @file authRoutes.js
 * @description Rotas para autenticação de usuários, geração de token JWT e rota protegida do dashboard.
 */

const {Router} = require('express')
const {verifyToken, authorizeRole} = require('../middlewares/authMiddleware')
const eventVolunteerController = require('../controllers/eventVolunteerController')
const authController = require('../controllers/authController')

const router = Router()

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Rota protegida acessível apenas por usuários autenticados
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo calculado a partir dos eventos e voluntários cadastrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [admin, volunteer]
 *                 summary:
 *                   type: object
 *                   properties:
 *                     activeCampaigns:
 *                       type: integer
 *                       description: Eventos com data e horário atuais ou futuros.
 *                     totalVolunteersRegistered:
 *                       type: integer
 *                       description: Contas com cadastro de voluntário.
 *       401:
 *         description: Token ausente ou inválido.
 *       500:
 *         description: Erro ao calcular o resumo do painel.
 */
router.get('/', verifyToken, authController.getDashboard)

/**
 * @swagger
 * /dashboard/admins:
 *   post:
 *     summary: Cria uma conta de administrador (apenas administradores)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
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
 *         description: Conta de administrador criada.
 *       400:
 *         description: Dados ausentes ou inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para administradores.
 *       409:
 *         description: Já existe uma conta com este e-mail.
 *       500:
 *         description: Erro interno ao criar a conta.
 */
router.post(
  '/admins',
  verifyToken,
  authorizeRole('admin'),
  authController.createAdmin,
)

/**
 * @swagger
 * /dashboard/participation-requests:
 *   get:
 *     summary: Lista todas as solicitações de participação (apenas administradores)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitações retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   eventId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                   requestedAt:
 *                     type: string
 *                     format: date-time
 *                   userName:
 *                     type: string
 *                   userEmail:
 *                     type: string
 *                     format: email
 *                   eventTitle:
 *                     type: string
 *                   eventDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para administradores.
 *       500:
 *         description: Erro ao consultar as solicitações.
 */
router.get(
  '/participation-requests',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.listAdminRequests,
)

/**
 * @swagger
 * /dashboard/my-participation-requests:
 *   get:
 *     summary: Lista as solicitações de participação do usuário autenticado
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitações do usuário retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   eventId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                   requestedAt:
 *                     type: string
 *                     format: date-time
 *                   eventTitle:
 *                     type: string
 *       401:
 *         description: Token ausente ou inválido.
 *       500:
 *         description: Erro ao consultar as solicitações.
 */
router.get(
  '/my-participation-requests',
  verifyToken,
  eventVolunteerController.listMyRequests,
)

/**
 * @swagger
 * /dashboard/participation-requests/{requestId}:
 *   patch:
 *     summary: Aprova ou recusa uma solicitação (apenas administradores)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: Identificador da solicitação
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Solicitação analisada com sucesso.
 *       400:
 *         description: Decisão inválida.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para administradores.
 *       404:
 *         description: Solicitação não encontrada.
 *       409:
 *         description: Solicitação já analisada ou não há mais vagas disponíveis.
 *       500:
 *         description: Erro ao analisar a solicitação.
 */
router.patch(
  '/participation-requests/:requestId',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.reviewRequest,
)

module.exports = router
