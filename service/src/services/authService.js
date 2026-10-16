/**
 * @file authService.js
 * @description Regras de negócio para autenticação e gestão de utilizadores.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

class AuthService {
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
    if (!user) throw new Error("Credenciais inválidas.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas.");

    return this.createSession(user);
  }

  async register(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    if (await userModel.findByEmail(normalizedEmail)) {
      const error = new Error("Já existe uma conta com este e-mail.");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await userModel.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      return this.createSession(user);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const conflictError = new Error(
          "Já existe uma conta com este e-mail.",
        );
        conflictError.status = 409;
        throw conflictError;
      }

      throw error;
    }
  }
}

module.exports = new AuthService();
