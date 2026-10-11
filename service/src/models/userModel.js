/**
 * @file userModel.js
 * @description Modelo de dados para operações de usuários no MySQL.
 */
const db = require("../config/database");

class UserModel {
  /**
   * Busca um usuário pelo endereço de e-mail.
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<Object|null>} Dados do usuário ou nulo.
   */
  async findByEmail(email) {
    const query =
      "SELECT id, name, email, password, role FROM users WHERE email = ?";
    const [rows] = await db.execute(query, [email]);
    return rows[0] || null;
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param {Object} userData - Dados do usuário.
   * @param {string} userData.name - Nome completo.
   * @param {string} userData.email - E-mail.
   * @param {string} userData.password - Senha criptografada (hash).
   * @param {string} userData.role - Papel do usuário ('admin' ou 'user').
   * @returns {Promise<Object>} Objeto com o ID inserido.
   */
  async create({ name, email, password, role = "user" }) {
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [name, email, password, role]);
    return { id: result.insertId, name, email, role };
  }
}

module.exports = new UserModel();
