/**
 * @file authService.js
 * @description Regras de negócio para autenticação e gestão de usuárioes.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

class AuthService {
  /**
   * Cria uma sessão para o usuário, gerando um token JWT
   * e retornando os dados básicos do usuário autenticado.
   *
   * @param {Object} user - Objeto do usuário previamente carregado/persistido.
   * @param {number|string} user.id - Identificador único do usuário.
   * @param {string} user.name - Nome do usuário.
   * @param {string} user.email - E-mail do usuário.
   * @param {string} user.role - Papel/perfil do usuário.
   * @returns {{ token: string, user: { id: number|string, name: string, email: string, role: string } }}
   * Objeto contendo o token JWT (validade de 8 horas) e os dados básicos do usuário.
   */
  createSession(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Realiza a autenticação de um usuário gerando um token JWT.
   * @param {string} email - E-mail do usuário.
   * @param {string} password - Senha em texto plano.
   * @returns {Promise<Object>} Token JWT e dados básicos do usuário.
   * @throws {Error} Se as credenciais forem inválidas.
   */
  async authenticate(email, password) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      const error = new Error("Credenciais inválidas.");
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Credenciais inválidas.");
      error.status = 401;
      throw error;
    }

    return this.createSession(user);
  }

  async getProfile(id) {
    const user = await userModel.findProfileById(id);
    if (!user) {
      const error = new Error("Conta não encontrada.");
      error.status = 404;
      throw error;
    }
    return user;
  }

  async updateProfile(id, { name, email }) {
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      const error = new Error("Nome e e-mail são obrigatórios.");
      error.status = 400;
      throw error;
    }
    if (normalizedName.length > 100 || normalizedEmail.length > 100) {
      const error = new Error(
        "Nome e e-mail devem ter no máximo 100 caracteres.",
      );
      error.status = 400;
      throw error;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      const error = new Error("Informe um e-mail válido.");
      error.status = 400;
      throw error;
    }

    try {
      await userModel.updateProfile(id, {
        name: normalizedName,
        email: normalizedEmail,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const conflictError = new Error(
          "Já existe uma conta ou cadastro de voluntário com este e-mail.",
        );
        conflictError.status = 409;
        throw conflictError;
      }
      throw error;
    }

    return this.getProfile(id);
  }

  async deleteAccount(id) {
    const deleted = await userModel.deleteAccount(id);
    if (!deleted) {
      const error = new Error("Conta não encontrada.");
      error.status = 404;
      throw error;
    }
  }

  /**
   * Registra um novo usuário no sistema.
   *
   * Normaliza o e-mail (remove espaços e converte para minúsculas),
   * verifica se já existe uma conta com o mesmo e-mail, aplica hash
   * na senha com bcrypt e persiste o novo usuário. Em caso de
   * sucesso, cria imediatamente uma sessão para o usuário recém-criado.
   *
   * @param {string} name - Nome do usuário (será armazenado sem espaços nas extremidades).
   * @param {string} email - E-mail do usuário (será normalizado para minúsculas e sem espaços).
   * @param {string} password - Senha em texto plano (será armazenada como hash bcrypt).
   * @returns {Promise<{ token: string, user: { id: number|string, name: string, email: string, role: string } }>}
   * Objeto contendo o token JWT e os dados básicos do usuário recém-registado.
   * @throws {Error} Com `status = 409` se já existir uma conta com o e-mail informado
   * (verificação prévia ou captura de `ER_DUP_ENTRY` do banco de dados).
   * @throws {Error} Repassa outros erros inesperados lançados pela camada de persistência.
   */
  async register(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    if (await userModel.findByEmail(normalizedEmail)) {
      const error = new Error("Já existe uma conta com este e-mail.");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await userModel.createVolunteer({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      return this.createSession(user);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const conflictError = new Error("Já existe uma conta com este e-mail.");
        conflictError.status = 409;
        throw conflictError;
      }

      throw error;
    }
  }

  async createAdmin(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    if (await userModel.findByEmail(normalizedEmail)) {
      const error = new Error("Já existe uma conta com este e-mail.");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await userModel.createAdmin({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const conflictError = new Error("Já existe uma conta com este e-mail.");
        conflictError.status = 409;
        throw conflictError;
      }
      throw error;
    }
  }
}

module.exports = new AuthService();
