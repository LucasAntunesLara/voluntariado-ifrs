/**
 * @file volunteerModel.js
 * @description Camada de Model para operações de voluntários no MySQL.
 */

const db = require('../config/database')

class VolunteerModel {
  /**
   * Retorna as contas de voluntários com seus dados complementares e inscrições.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async findAll() {
    const [volunteers] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at AS createdAt,
              v.id AS volunteerId, v.phone,
              v.course_or_affiliation AS courseOrAffiliation
       FROM users u
       LEFT JOIN volunteers v
         ON v.user_id = u.id OR (v.user_id IS NULL AND v.email = u.email)
       WHERE u.role = 'volunteer'
       ORDER BY u.name ASC`,
    )

    const [registrations] = await db.query(
      `SELECT COALESCE(ev.user_id, v.user_id) AS userId,
              e.title AS eventTitle, ev.status, ev.registered_at AS registeredAt
       FROM event_volunteers ev
       JOIN events e ON e.id = ev.event_id
       LEFT JOIN volunteers v ON v.id = ev.volunteer_id
       WHERE COALESCE(ev.user_id, v.user_id) IS NOT NULL
         AND EXISTS (
           SELECT 1
           FROM users u
           WHERE u.id = COALESCE(ev.user_id, v.user_id)
             AND u.role = 'volunteer'
         )
       ORDER BY ev.registered_at DESC`,
    )

    const registrationsByUser = new Map()
    for (const registration of registrations) {
      const userRegistrations =
        registrationsByUser.get(registration.userId) || []
      userRegistrations.push({
        eventTitle: registration.eventTitle,
        status: registration.status,
        registeredAt: registration.registeredAt,
      })
      registrationsByUser.set(registration.userId, userRegistrations)
    }

    return volunteers.map(volunteer => ({
      ...volunteer,
      events: registrationsByUser.get(volunteer.id) || [],
    }))
  }

  /**
   * Busca um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<Object|null>} Dados do voluntário ou null.
   */
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, course_or_affiliation, created_at FROM volunteers WHERE id = ?',
      [id],
    )
    return rows[0] || null
  }

  /**
   * Busca um voluntário pelo e-mail.
   * @param {string} email - E-mail do voluntário.
   * @returns {Promise<Object|null>} Dados do voluntário ou null.
   */
  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, course_or_affiliation, created_at FROM volunteers WHERE email = ?',
      [email],
    )
    return rows[0] || null
  }

  /**
   * Cadastra um novo voluntário.
   * @param {Object} volunteerData - Dados do voluntário.
   * @returns {Promise<number>} ID do voluntário criado.
   */
  async create({name, email, phone, courseOrAffiliation}) {
    const [result] = await db.query(
      'INSERT INTO volunteers (name, email, phone, course_or_affiliation) VALUES (?, ?, ?, ?)',
      [name, email, phone, courseOrAffiliation || 'Comunidade Externa'],
    )
    return result.insertId
  }

  /**
   * Atualiza os dados de um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @param {Object} volunteerData - Novos dados do voluntário.
   * @returns {Promise<boolean>} True se atualizado com sucesso.
   */
  async update(id, {name, email, phone, courseOrAffiliation}) {
    const [result] = await db.query(
      'UPDATE volunteers SET name = ?, email = ?, phone = ?, course_or_affiliation = ? WHERE id = ?',
      [name, email, phone, courseOrAffiliation, id],
    )
    return result.affectedRows > 0
  }

  /**
   * Elimina um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<boolean>} True se eliminado com sucesso.
   */
  async delete(id) {
    const [result] = await db.query('DELETE FROM volunteers WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = new VolunteerModel()
