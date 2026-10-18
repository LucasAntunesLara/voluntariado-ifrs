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
      `SELECT v.id, v.id AS volunteerId, u.id AS userId,
              v.name, v.email, u.role, v.created_at AS createdAt, v.phone,
              v.course_or_affiliation AS courseOrAffiliation
       FROM volunteers v
       LEFT JOIN users u
         ON u.id = v.user_id
         OR (v.user_id IS NULL AND v.email = u.email AND u.role = 'volunteer')
       WHERE u.id IS NULL OR u.role = 'volunteer'
       ORDER BY v.name ASC`,
    )

    const [registrations] = await db.query(
      `SELECT ev.user_id AS userId, ev.volunteer_id AS volunteerId,
              e.title AS eventTitle, ev.status, ev.registered_at AS registeredAt
       FROM event_volunteers ev
       JOIN events e ON e.id = ev.event_id
       WHERE ev.user_id IS NOT NULL OR ev.volunteer_id IS NOT NULL
       ORDER BY ev.registered_at DESC`,
    )

    const registrationsByUser = new Map()
    const registrationsByVolunteer = new Map()
    for (const registration of registrations) {
      const event = {
        eventTitle: registration.eventTitle,
        status: registration.status,
        registeredAt: registration.registeredAt,
      }

      if (registration.userId) {
        const userRegistrations =
          registrationsByUser.get(registration.userId) || []
        userRegistrations.push(event)
        registrationsByUser.set(registration.userId, userRegistrations)
      }

      if (registration.volunteerId) {
        const volunteerRegistrations =
          registrationsByVolunteer.get(registration.volunteerId) || []
        volunteerRegistrations.push(event)
        registrationsByVolunteer.set(
          registration.volunteerId,
          volunteerRegistrations,
        )
      }
    }

    return volunteers.map(volunteer => ({
      ...volunteer,
      events:
        registrationsByUser.get(volunteer.userId) ||
        registrationsByVolunteer.get(volunteer.volunteerId) ||
        [],
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
