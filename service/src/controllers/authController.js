/**
 * @file authController.js
 * @description Controlador para rotas de autenticação.
 */
const authService = require('../services/authService')
const dashboardModel = require('../models/dashboardModel')

class AuthController {
  /**
   * Manipula a requisição HTTP de login.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   * @returns {Promise<void>}
   */
  async login(req, res) {
    try {
      const {email, password} = req.body

      if (!email || !password) {
        return res.status(400).json({error: 'E-mail e senha são obrigatórios.'})
      }

      const result = await authService.authenticate(email, password)

      return res.status(200).json(result)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  async register(req, res) {
    try {
      const {name, email, phone, password} = req.body

      if (
        !name?.trim() ||
        !email?.trim() ||
        typeof phone !== 'string' ||
        !phone.trim() ||
        !password
      ) {
        return res
          .status(400)
          .json({error: 'Nome, e-mail, telefone e senha são obrigatórios.'})
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({error: 'Informe um e-mail válido.'})
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({error: 'A senha deve ter pelo menos 8 caracteres.'})
      }

      const result = await authService.register(name, email, phone, password)

      return res.status(201).json(result)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id)
      return res.status(200).json(profile)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  async updateProfile(req, res) {
    try {
      const profile = await authService.updateProfile(req.user.id, req.body)
      return res.status(200).json(profile)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  async deleteAccount(req, res) {
    try {
      await authService.deleteAccount(req.user.id)
      return res.sendStatus(204)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  async createAdmin(req, res) {
    try {
      const {name, email, password} = req.body
      if (!name?.trim() || !email?.trim() || !password) {
        return res
          .status(400)
          .json({error: 'Nome, e-mail e senha são obrigatórios.'})
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({error: 'Informe um e-mail válido.'})
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({error: 'A senha deve ter pelo menos 8 caracteres.'})
      }

      const admin = await authService.createAdmin(name, email, password)
      return res.status(201).json(admin)
    } catch (error) {
      return res.status(error.status || 500).json({error: error.message})
    }
  }

  /**
   * Retorna os dados do dashboard para o usuário autenticado.
   * @param {Object} req - Requisição HTTP (contém dados decodificados do JWT via middleware).
   * @param {Object} res - Resposta HTTP.
   */
  async getDashboard(req, res) {
    try {
      const summary = await dashboardModel.getSummary()
      return res.status(200).json({
        message: 'Acesso autorizado ao painel.',
        user: {
          email: req.user.email,
          role: req.user.role,
        },
        summary,
      })
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  }
}

module.exports = new AuthController()
