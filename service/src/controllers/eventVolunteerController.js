/**
 * @file eventVolunteerController.js
 * @description Camada de Controller para gerenciamento de requisições de inscrições.
 */

const eventVolunteerService = require("../services/eventVolunteerService");

class EventVolunteerController {
  /**
   * Inscreve um voluntário num evento.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async register(req, res) {
    try {
      const { eventId } = req.params;
      const { volunteerId } = req.body;

      if (!volunteerId) {
        return res
          .status(400)
          .json({ error: "O ID do voluntário é obrigatório." });
      }

      const result = await eventVolunteerService.registerVolunteer(
        Number(eventId),
        Number(volunteerId),
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Remove um voluntário de um evento.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async unregister(req, res) {
    try {
      const { eventId, volunteerId } = req.params;
      await eventVolunteerService.unregisterVolunteer(
        Number(eventId),
        Number(volunteerId),
      );
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  /**
   * Lista todos os voluntários de um evento específico.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async listEventVolunteers(req, res) {
    try {
      const { eventId } = req.params;
      const volunteers = await eventVolunteerService.getVolunteersOfEvent(
        Number(eventId),
      );
      return res.status(200).json(volunteers);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new EventVolunteerController();
