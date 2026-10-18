/**
 * @file authController.js
 * @description Controlador para rotas de autenticação.
 */
const authService = require("../services/authService");

class AuthController {
  /**
   * Manipula a requisição HTTP de login.
   * @param {import('express').Request} req - Requisição HTTP.
   * @param {import('express').Response} res - Resposta HTTP.
   * @returns {Promise<void>}
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const result = await authService.authenticate(email, password);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Registra um voluntário e inicia a sessão.
   * @param {import('express').Request} req - Requisição com os dados cadastrais.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (
        !name?.trim() ||
        !email?.trim() ||
        typeof phone !== "string" ||
        !phone.trim() ||
        !password
      ) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail, telefone e senha são obrigatórios." });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: "Informe um e-mail válido." });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "A senha deve ter pelo menos 8 caracteres." });
      }

      const result = await authService.register(name, email, phone, password);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Retorna o perfil do usuário autenticado.
   * @param {import('express').Request} req - Requisição com o usuário do JWT.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Atualiza o perfil do usuário autenticado.
   * @param {import('express').Request} req - Requisição com os campos do perfil.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  async updateProfile(req, res) {
    try {
      const profile = await authService.updateProfile(req.user.id, req.body);
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Exclui a conta do usuário autenticado.
   * @param {import('express').Request} req - Requisição com o usuário do JWT.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  async deleteAccount(req, res) {
    try {
      await authService.deleteAccount(req.user.id);
      return res.sendStatus(204);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Cria uma conta de administrador.
   * @param {import('express').Request} req - Requisição com os dados do admin.
   * @param {import('express').Response} res - Resposta HTTP.
   */
  async createAdmin(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name?.trim() || !email?.trim() || !password) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail e senha são obrigatórios." });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: "Informe um e-mail válido." });
      }
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "A senha deve ter pelo menos 8 caracteres." });
      }

      const admin = await authService.createAdmin(name, email, password);
      return res.status(201).json(admin);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  /**
   * Retorna os dados do dashboard para o usuário autenticado.
   * @param {import('express').Request} req - Requisição com o usuário do JWT.
   * @param {import('express').Response} res - Resposta HTTP.
   * @returns {Promise<void>}
   */
  async getDashboard(req, res) {
    try {
      return res.status(200).json({
        message: "Acesso autorizado ao painel.",
        user: {
          email: req.user.email,
          role: req.user.role,
        },
        summary: {
          activeCampaigns: 3,
          totalVolunteersRegistered: 4,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
