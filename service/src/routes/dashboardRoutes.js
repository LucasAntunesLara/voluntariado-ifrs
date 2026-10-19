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
router.post(
  '/admins',
  verifyToken,
  authorizeRole('admin'),
  authController.createAdmin,
)
router.get(
  '/participation-requests',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.listAdminRequests,
)
router.get(
  '/my-participation-requests',
  verifyToken,
  eventVolunteerController.listMyRequests,
)
router.patch(
  '/participation-requests/:requestId',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.reviewRequest,
)

module.exports = router
