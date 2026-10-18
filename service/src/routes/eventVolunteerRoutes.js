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
 */
router.get('/:eventId/volunteers', eventVolunteerController.listEventVolunteers)

/**
 * @swagger
 * /events/{eventId}/volunteers:
 *   post:
 *     summary: Inscreve um voluntário em um evento
 *     tags: [EventVolunteers]
 *     security:
 *       - BearerAuth: []
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
 *       - BearerAuth: []
 */
router.delete(
  '/:eventId/volunteers/:volunteerId',
  verifyToken,
  authorizeRole('admin'),
  eventVolunteerController.unregister,
)

module.exports = router
