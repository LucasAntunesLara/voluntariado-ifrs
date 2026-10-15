/**
 * @file eventVolunteerModel.js
 * @description Camada de Model para gerir as inscrições de voluntários em eventos.
 */

const pool = require("../config/database");

class EventVolunteerModel {
  /**
   * Inscreve um voluntário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<number>} ID da inscrição criada.
   */
  async create(eventId, volunteerId) {
    const [result] = await pool.query(
      "INSERT INTO event_volunteers (event_id, volunteer_id) VALUES (?, ?)",
      [eventId, volunteerId],
    );
    return result.insertId;
  }

  /**
   * Remove a inscrição de um voluntário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<boolean>} True se removido com sucesso.
   */
  async delete(eventId, volunteerId) {
    const [result] = await pool.query(
      "DELETE FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?",
      [eventId, volunteerId],
    );
    return result.affectedRows > 0;
  }

  /**
   * Retorna a contagem atual de voluntários inscritos em um evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<number>} Número total de inscritos.
   */
  async countByEvent(eventId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM event_volunteers WHERE event_id = ?",
      [eventId],
    );
    return rows[0].total;
  }

  /**
   * Verifica se um voluntário já está inscrito em um evento específico.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<Object|null>} Registo da inscrição ou null.
   */
  async findByEventAndVolunteer(eventId, volunteerId) {
    const [rows] = await pool.query(
      "SELECT * FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?",
      [eventId, volunteerId],
    );
    return rows[0] || null;
  }

  /**
   * Lista todos os voluntários inscritos em um evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async findVolunteersByEvent(eventId) {
    const [rows] = await pool.query(
      `SELECT v.id, v.name, v.email, v.phone, v.course_or_affiliation, ev.registered_at
       FROM volunteers v
       JOIN event_volunteers ev ON v.id = ev.volunteer_id
       WHERE ev.event_id = ?
       ORDER BY ev.registered_at ASC`,
      [eventId],
    );
    return rows;
  }
}

module.exports = new EventVolunteerModel();
