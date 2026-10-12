/**
 * @file eventController.js
 * @description Controlador para rotas de eventos.
 */
const EventService = require("../services/eventService");

class EventController {
  /**
   * Manipula a requisição HTTP de eventos.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   * @returns {Promise<void>}
   */
  static async getAll(req, res) {
    try {
      const events = await EventService.getAll();
      res.json(events);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = EventController;
