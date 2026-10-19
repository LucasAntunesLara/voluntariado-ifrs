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
              u.name, u.email, u.role, v.created_at AS createdAt, v.phone,
              v.course_or_affiliation AS courseOrAffiliation
       FROM volunteers v
       JOIN users u ON u.id = v.user_id
       WHERE u.role = 'volunteer'
       ORDER BY u.name ASC`,
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
      `SELECT v.id, v.user_id AS userId, u.name, u.email, v.phone,
              v.course_or_affiliation, v.created_at
       FROM volunteers v
       JOIN users u ON u.id = v.user_id
       WHERE v.id = ?`,
      [id],
    )
    return rows[0] || null
  }

  /**
   * Busca o identificador do cadastro de voluntário associado a uma conta.
   * @param {number} userId - Identificador da conta do usuário.
   * @returns {Promise<{id: number}|null>} Identificador do cadastro ou null se não existir.
   */
  async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT id FROM volunteers WHERE user_id = ?',
      [userId],
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
      `SELECT v.id, v.user_id AS userId, u.name, u.email, v.phone,
              v.course_or_affiliation, v.created_at
       FROM volunteers v
       JOIN users u ON u.id = v.user_id
       WHERE u.email = ?`,
      [email],
    )
    return rows[0] || null
  }

  /**
   * Atualiza os dados de um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @param {Object} volunteerData - Novos dados do voluntário.
   * @returns {Promise<boolean>} True se atualizado com sucesso.
   */
  async update(id, {name, email, phone, courseOrAffiliation}) {
    const connection = await db.getConnection()
    try {
      await connection.beginTransaction()

      const [volunteers] = await connection.execute(
        'SELECT user_id FROM volunteers WHERE id = ? FOR UPDATE',
        [id],
      )
      if (!volunteers[0]) {
        await connection.rollback()
        return false
      }

      await connection.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, volunteers[0].user_id],
      )
      const [result] = await connection.execute(
        'UPDATE volunteers SET phone = ?, course_or_affiliation = ? WHERE id = ?',
        [phone, courseOrAffiliation, id],
      )
      await connection.commit()
      return result.affectedRows > 0
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
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
