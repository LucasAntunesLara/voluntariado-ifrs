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
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Retorna um evento pelo ID.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  static async getById(req, res) {
    try {
      const id = req.params.id;

      const event = await EventService.getById(id);
      res.json(event);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Cria um evento a partir da requisição do administrador autenticado.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  static async create(req, res) {
    try {
      const id = await EventService.create(req.body);
      return res
        .status(201)
        .json({ message: "Evento criado com sucesso.", id });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Atualiza os dados de um evento.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  static async update(req, res) {
    try {
      const id = req.params.id;
      await EventService.update(id, req.body, req.user);
      return res.json({ message: "Evento atualizado com sucesso." });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Exclui um evento pelo ID.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  static async delete(req, res) {
    try {
      const id = req.params.id;
      await EventService.delete(id, req.user);
      return res.json({ message: "Evento deletado com sucesso." });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = EventController;
