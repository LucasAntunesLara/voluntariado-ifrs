/**
 * @file volunteerController.js
 * @description Camada de Controller para gerenciamento de requisições de voluntários.
 */

const VolunteerService = require("../services/volunteerService");

class VolunteerController {
  /**
   * Lista todos os voluntários.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async getAll(req, res) {
    try {
      const volunteers = await VolunteerService.getAllVolunteers();
      return res.status(200).json(volunteers);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Acessa um voluntário pelo ID.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async getById(req, res) {
    try {
      const id = req.params.id;

      const volunteer = await VolunteerService.getById(id);
      res.json(volunteer);
    } catch (error) {
      res.status(error.status || 404).json({ error: error.message });
    }
  }

  /**
   * Cadastra um novo voluntário.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async create(req, res) {
    try {
      const newVolunteer = await VolunteerService.create(req.body);
      return res.status(201).json(newVolunteer);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Atualiza os dados de um voluntário.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedVolunteer = await VolunteerService.update(id, req.body);
      return res.status(200).json(updatedVolunteer);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Remove um voluntário.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      await VolunteerService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new VolunteerController();
