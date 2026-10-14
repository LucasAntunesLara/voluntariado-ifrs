/**
 * @file volunteerModel.js
 * @description Camada de Model para operações de voluntários no MySQL.
 */

const db = require("../config/database");

class VolunteerModel {
  /**
   * Retorna todos os voluntários cadastrados.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async findAll() {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, course_or_affiliation, created_at FROM volunteers ORDER BY name ASC",
    );
    return rows;
  }

  /**
   * Busca um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<Object|null>} Dados do voluntário ou null.
   */
  async findById(id) {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, course_or_affiliation, created_at FROM volunteers WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Busca um voluntário pelo e-mail.
   * @param {string} email - E-mail do voluntário.
   * @returns {Promise<Object|null>} Dados do voluntário ou null.
   */
  async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, course_or_affiliation, created_at FROM volunteers WHERE email = ?",
      [email],
    );
    return rows[0] || null;
  }

  /**
   * Cadastra um novo voluntário.
   * @param {Object} volunteerData - Dados do voluntário.
   * @returns {Promise<number>} ID do voluntário criado.
   */
  async create({ name, email, phone, courseOrAffiliation }) {
    const [result] = await db.query(
      "INSERT INTO volunteers (name, email, phone, course_or_affiliation) VALUES (?, ?, ?, ?)",
      [name, email, phone, courseOrAffiliation || "Comunidade Externa"],
    );
    return result.insertId;
  }

  /**
   * Atualiza os dados de um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @param {Object} volunteerData - Novos dados do voluntário.
   * @returns {Promise<boolean>} True se atualizado com sucesso.
   */
  async update(id, { name, email, phone, courseOrAffiliation }) {
    const [result] = await db.query(
      "UPDATE volunteers SET name = ?, email = ?, phone = ?, course_or_affiliation = ? WHERE id = ?",
      [name, email, phone, courseOrAffiliation, id],
    );
    return result.affectedRows > 0;
  }

  /**
   * Elimina um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<boolean>} True se eliminado com sucesso.
   */
  async delete(id) {
    const [result] = await db.query("DELETE FROM volunteers WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = new VolunteerModel();
