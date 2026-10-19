/**
 * @file eventVolunteerService.js
 * @description Camada de Service para regras de negócio de inscrições em eventos.
 */

const eventVolunteerModel = require('../models/eventVolunteerModel')
const eventModel = require('../models/eventModel')

class EventVolunteerService {
  /**
   * Solicita a participação de um usuário em um evento.
   * @param {number} eventId - Identificador do evento.
   * @param {number} userId - Identificador do usuário voluntário.
   * @returns {Promise<{id: number, eventId: number, status: 'pending'}>} Solicitação criada ou reaberta.
   * @throws {Error} Com status 404 se o evento não existir ou 409 se não houver vaga
   * ou já existir uma solicitação/inscrição válida.
   */
  async requestParticipation(eventId, userId) {
    return await eventVolunteerModel.createRequest(eventId, userId)
  }

  /**
   * Registra a decisão administrativa sobre uma solicitação pendente.
   * @param {number} requestId - Identificador da solicitação.
   * @param {'approved'|'rejected'} decision - Decisão a aplicar.
   * @returns {Promise<Object>} Solicitação atualizada.
   * @throws {Error} Com status 400 para decisão inválida, 404 para solicitação/evento ausente,
   * ou 409 se já analisada ou recusada automaticamente por falta de vagas.
   */
  async reviewRequest(requestId, decision) {
    if (!['approved', 'rejected'].includes(decision)) {
      const error = new Error("A decisão deve ser 'approved' ou 'rejected'.")
      error.status = 400
      throw error
    }

    const result = await eventVolunteerModel.reviewRequest(requestId, decision)
    if (result.capacityRejected) {
      const error = new Error(
        'As vagas foram preenchidas. A solicitação foi recusada automaticamente.',
      )
      error.status = 409
      error.request = result
      throw error
    }
    return result
  }

  /**
   * Obtém todas as solicitações para análise administrativa.
   * @returns {Promise<Array<Object>>} Lista de solicitações com dados de usuários e eventos.
   */
  async getRequestsForAdmin() {
    return await eventVolunteerModel.findRequestsForAdmin()
  }

  /**
   * Obtém as solicitações de um usuário.
   * @param {number} userId - Identificador do usuário.
   * @returns {Promise<Array<Object>>} Lista de solicitações do usuário.
   */
  async getRequestsByUser(userId) {
    return await eventVolunteerModel.findRequestsByUser(userId)
  }

  /**
   * Cancela a inscrição de um voluntário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<boolean>}
   * @throws {Error} Se a inscrição não for encontrada.
   */
  async unregisterVolunteer(eventId, volunteerId) {
    const existingRegistration =
      await eventVolunteerModel.findByEventAndVolunteer(eventId, volunteerId)
    if (!existingRegistration) {
      throw new Error(
        'Inscrição não encontrada para este voluntário neste evento.',
      )
    }

    return await eventVolunteerModel.delete(eventId, volunteerId)
  }

  /**
   * Remove uma inscrição pelo identificador do vínculo.
   * @param {number} eventId - Identificador do evento.
   * @param {number} registrationId - Identificador da inscrição.
   * @returns {Promise<void>} Conclui quando a inscrição é removida.
   * @throws {Error} Com status 404 se a inscrição não existir para o evento.
   */
  async removeRegistration(eventId, registrationId) {
    const removed = await eventVolunteerModel.deleteRegistration(
      eventId,
      registrationId,
    )
    if (!removed) {
      const error = new Error(
        'Inscrição não encontrada para este voluntário neste evento.',
      )
      error.status = 404
      throw error
    }
  }

  /**
   * Lista todos os voluntários inscritos em um determinado evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<Array>} Lista de voluntários.
   * @throws {Error} Se o evento não existir.
   */
  async getVolunteersOfEvent(eventId) {
    const event = await eventModel.findById(eventId)
    if (!event) {
      throw new Error('Evento não encontrado.')
    }

    return await eventVolunteerModel.findVolunteersByEvent(eventId)
  }
}

module.exports = new EventVolunteerService()
