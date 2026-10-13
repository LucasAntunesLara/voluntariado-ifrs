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

  static async getById(req, res) {
    try {
      const id = req.params.id;
      res.json(pet);
    } catch (error) {
      res.status(error.status || 404).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await EventService.create(req.body, req.user);
      res.status(201).json({ message: "Evento criado com sucesso.", id });
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      await EventService.update(id, req.body, req.user);
      res.json({ message: "Evento atualizado com sucesso." });
    } catch (error) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      await EventService.delete(id, req.user);
      res.json({ message: "Evento deletado com sucesso." });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = EventController;
