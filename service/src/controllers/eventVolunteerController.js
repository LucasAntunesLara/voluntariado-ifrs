/**
 * @file eventVolunteerController.js
 * @description Camada de Controller para gerenciamento de requisições de inscrições.
 */

const eventVolunteerService = require('../services/eventVolunteerService')

class EventVolunteerController {
  /**
   * Inscreve um voluntário num evento.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async register(req, res) {
    try {
      const {eventId} = req.params
      const result = await eventVolunteerService.requestParticipation(
        Number(eventId),
        Number(req.user.id),
      )
      return res.status(201).json(result)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  /**
   * Remove um voluntário de um evento.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async unregister(req, res) {
    try {
      const {eventId, volunteerId} = req.params
      await eventVolunteerService.unregisterVolunteer(
        Number(eventId),
        Number(volunteerId),
      )
      return res.status(204).send()
    } catch (error) {
      return res.status(404).json({error: error.message})
    }
  }

  /**
   * @swagger
   * /events/{eventId}/registrations/{registrationId}:
   *   delete:
   *     summary: Remove uma inscrição de voluntário de um evento
   *     tags: [Inscrições]
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do evento
   *       - in: path
   *         name: registrationId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da inscrição
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Inscrição removida com sucesso
   *       401:
   *         description: Token de autenticação ausente ou inválido
   *       403:
   *         description: Acesso permitido somente para administradores
   *       404:
   *         description: Inscrição não encontrada para o evento informado
   *       500:
   *         description: Erro ao remover a inscrição
   */
  async removeRegistration(req, res) {
    try {
      const {eventId, registrationId} = req.params
      await eventVolunteerService.removeRegistration(
        Number(eventId),
        Number(registrationId),
      )
      return res.status(204).send()
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  /**
   * Lista todos os voluntários de um evento específico.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async listEventVolunteers(req, res) {
    try {
      const {eventId} = req.params
      const volunteers = await eventVolunteerService.getVolunteersOfEvent(
        Number(eventId),
      )
      return res.status(200).json(volunteers)
    } catch (error) {
      return res.status(404).json({error: error.message})
    }
  }

  async listAdminRequests(req, res) {
    try {
      const requests = await eventVolunteerService.getRequestsForAdmin()
      return res.status(200).json(requests)
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  }

  async listMyRequests(req, res) {
    try {
      const requests = await eventVolunteerService.getRequestsByUser(
        Number(req.user.id),
      )
      return res.status(200).json(requests)
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  }

  async reviewRequest(req, res) {
    try {
      const {status} = req.body
      const result = await eventVolunteerService.reviewRequest(
        Number(req.params.requestId),
        status,
      )
      return res.status(200).json(result)
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message,
        request: error.request,
      })
    }
  }
}

module.exports = new EventVolunteerController()
