/**
 * @file eventVolunteerService.js
 * @description Camada de Service para regras de negócio de inscrições em eventos.
 */

const eventVolunteerModel = require("../models/eventVolunteerModel");
const eventModel = require("../models/eventModel");
const volunteerModel = require("../models/volunteerModel");

class EventVolunteerService {
  /**
   * Realiza a inscrição de um voluntário em um evento com validações de negócio.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<Object>} Dados da inscrição.
   * @throws {Error} Se o evento estiver cheio, não existir ou se já estiver inscrito.
   */
  async registerVolunteer(eventId, volunteerId) {
    const event = await eventModel.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    const volunteer = await volunteerModel.findById(volunteerId);
    if (!volunteer) {
      throw new Error("Voluntário não encontrado.");
    }

    const existingRegistration =
      await eventVolunteerModel.findByEventAndVolunteer(eventId, volunteerId);
    if (existingRegistration) {
      throw new Error("O voluntário já se encontra inscrito neste evento.");
    }

    const currentCount = await eventVolunteerModel.countByEvent(eventId);
    if (currentCount >= event.max_volunteers) {
      throw new Error(
        "O limite máximo de voluntários para este evento já foi atingido.",
      );
    }

    const registrationId = await eventVolunteerModel.create(
      eventId,
      volunteerId,
    );

    return {
      id: registrationId,
      eventId,
      volunteerId,
      message: "Voluntário inscrito com sucesso no evento.",
    };
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
