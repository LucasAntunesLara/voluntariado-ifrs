/**
 * @file eventVolunteerService.js
 * @description Camada de Service para regras de negócio de inscrições em eventos.
 */

const eventVolunteerModel = require("../models/eventVolunteerModel");
const eventModel = require("../models/eventModel");

class EventVolunteerService {
  async requestParticipation(eventId, userId) {
    return await eventVolunteerModel.createRequest(eventId, userId);
  }

  async reviewRequest(requestId, decision) {
    if (!["approved", "rejected"].includes(decision)) {
      const error = new Error("A decisão deve ser 'approved' ou 'rejected'.");
      error.status = 400;
      throw error;
    }

    const result = await eventVolunteerModel.reviewRequest(requestId, decision);
    if (result.capacityRejected) {
      const error = new Error(
        "As vagas foram preenchidas. A solicitação foi recusada automaticamente.",
      );
      error.status = 409;
      error.request = result;
      throw error;
    }
    return result;
  }

  async getRequestsForAdmin() {
    return await eventVolunteerModel.findRequestsForAdmin();
  }

  async getRequestsByUser(userId) {
    return await eventVolunteerModel.findRequestsByUser(userId);
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
      await eventVolunteerModel.findByEventAndVolunteer(eventId, volunteerId);
    if (!existingRegistration) {
      throw new Error(
        "Inscrição não encontrada para este voluntário neste evento.",
      );
    }

    return await eventVolunteerModel.delete(eventId, volunteerId);
  }

  /**
   * Lista todos os voluntários inscritos em um determinado evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<Array>} Lista de voluntários.
   * @throws {Error} Se o evento não existir.
   */
  async getVolunteersOfEvent(eventId) {
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    return await eventVolunteerModel.findVolunteersByEvent(eventId);
  }
}

module.exports = new EventVolunteerService();
