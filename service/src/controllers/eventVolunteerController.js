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
   * Remove uma inscrição usando os identificadores do evento e do vínculo.
   * @param {Object} req - Requisição com `eventId` e `registrationId` em `params`.
   * @param {Object} res - Resposta HTTP.
   * @returns {Promise<Object>} Resposta sem conteúdo ou erro da operação.
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

  /**
   * Lista todas as solicitações de participação para análise administrativa.
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   * @returns {Promise<Object>} Lista de solicitações ou erro da consulta.
   */
  async listAdminRequests(req, res) {
    try {
      const requests = await eventVolunteerService.getRequestsForAdmin()
      return res.status(200).json(requests)
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  }

  /**
   * Lista as solicitações de participação do usuário autenticado.
   * @param {Object} req - Requisição com o usuário identificado pelo token.
   * @param {Object} res - Resposta HTTP.
   * @returns {Promise<Object>} Lista de solicitações ou erro da consulta.
   */
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

  /**
   * Aprova ou recusa uma solicitação de participação.
   * @param {Object} req - Requisição com o ID da solicitação e a decisão em `body.status`.
   * @param {Object} res - Resposta HTTP.
   * @returns {Promise<Object>} Resultado da análise ou erro da operação.
   */
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
