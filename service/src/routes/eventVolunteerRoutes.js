/**
 * @file eventVolunteerRoutes.js
 * @description Rotas para o gerenciamento de inscrições de voluntários em eventos.
 */

const {Router} = require('express')
const eventVolunteerController = require('../controllers/eventVolunteerController')
const {verifyToken, authorizeRole} = require('../middlewares/authMiddleware')

const router = Router()

/**
 * @swagger
 * /events/{eventId}/volunteers:
 *   get:
 *     summary: Lista todos os voluntários inscritos em um evento
 *     tags: [EventVolunteers]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participantes confirmados retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - registrationId
 *                   - id
 *                   - name
 *                   - email
 *                   - status
 *                 properties:
 *                   registrationId:
 *                     type: integer
 *                     description: Identificador da inscrição no evento.
 *                   id:
 *                     type: integer
 *                     description: Identificador do voluntário ou da conta.
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                   course_or_affiliation:
 *                     type: string
 *                     nullable: true
 *                   registered_at:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [approved]
 *       404:
 *         description: Evento não encontrado.
 *       500:
 *         description: Erro ao consultar os participantes.
 */
router.get('/:eventId/volunteers', eventVolunteerController.listEventVolunteers)

/**
 * @swagger
 * /events/{eventId}/volunteers:
 *   post:
 *     summary: Inscreve um voluntário em um evento
 *     tags: [EventVolunteers]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Solicitação de participação criada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 eventId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [pending]
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para voluntários.
 *       404:
 *         description: Evento não encontrado.
 *       409:
 *         description: Não há vagas ou já existe solicitação para este evento.
 *       500:
 *         description: Erro ao criar a solicitação.
 */
router.post(
  '/:eventId/volunteers',
  verifyToken,
  authorizeRole('volunteer'),
  eventVolunteerController.register,
)

/**
 * @swagger
 * /events/{eventId}/volunteers/{volunteerId}:
 *   delete:
 *     summary: Remove a inscrição de um voluntário em um evento
 *     tags: [EventVolunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *       - in: path
 *         name: volunteerId
 *         required: true
 *         description: ID do voluntário
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Inscrição removida com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para administradores.
 *       404:
 *         description: Inscrição não encontrada.
 *       500:
 *         description: Erro ao remover a inscrição.
 */
router.delete(
  '/:eventId/volunteers/:volunteerId',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.unregister,
)

/**
 * @swagger
 * /events/{eventId}/registrations/{registrationId}:
 *   delete:
 *     summary: Remove uma inscrição pelo identificador do vínculo
 *     tags: [EventVolunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *       - in: path
 *         name: registrationId
 *         required: true
 *         description: ID da inscrição que será removida
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Inscrição removida com sucesso.
 *       401:
 *         description: Token de autenticação ausente ou inválido.
 *       403:
 *         description: Acesso permitido somente para administradores.
 *       404:
 *         description: Inscrição não encontrada para o evento informado.
 *       500:
 *         description: Erro interno ao remover a inscrição.
 */
router.delete(
  '/:eventId/registrations/:registrationId',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.removeRegistration,
)

module.exports = router
