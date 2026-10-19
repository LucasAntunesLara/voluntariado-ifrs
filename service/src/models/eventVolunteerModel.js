/**
 * @file eventVolunteerModel.js
 * @description Camada de Model para gerir as inscrições de voluntários em eventos.
 */

const pool = require('../config/database')

class EventVolunteerModel {
  /**
   * Remove a inscrição de um voluntário em um evento.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<boolean>} True se removido com sucesso.
   */
  async delete(eventId, volunteerId) {
    const [result] = await pool.query(
      'DELETE FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId],
    )
    return result.affectedRows > 0
  }

  /**
   * Remove um vínculo de inscrição pelo identificador da inscrição e do evento.
   * @param {number} eventId - Identificador do evento.
   * @param {number} registrationId - Identificador do vínculo de inscrição.
   * @returns {Promise<boolean>} Indica se uma inscrição foi removida.
   */
  async deleteRegistration(eventId, registrationId) {
    const [result] = await pool.query(
      'DELETE FROM event_volunteers WHERE event_id = ? AND id = ?',
      [eventId, registrationId],
    )
    return result.affectedRows > 0
  }

  /**
   * Retorna a contagem atual de voluntários inscritos em um evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<number>} Número total de inscritos.
   */
  async countByEvent(eventId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM event_volunteers WHERE event_id = ? AND status = 'approved'",
      [eventId],
    )
    return rows[0].total
  }

  /**
   * Cria ou reabre uma solicitação de participação, garantindo a capacidade do evento.
   * @param {number} eventId - Identificador do evento.
   * @param {number} userId - Identificador do usuário voluntário.
   * @returns {Promise<{id: number, eventId: number, status: 'pending'}>} Solicitação pendente criada.
   * @throws {Error} Com status 404 se o evento não existir ou 409 se não houver vaga
   * ou já existir uma solicitação/inscrição não recusada.
   */
  async createRequest(eventId, userId) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [events] = await connection.query(
        'SELECT id, max_volunteers FROM events WHERE id = ? FOR UPDATE',
        [eventId],
      )
      const event = events[0]
      if (!event) {
        const error = new Error('Evento não encontrado.')
        error.status = 404
        throw error
      }

      const [confirmedVolunteers] = await connection.query(
        "SELECT id FROM event_volunteers WHERE event_id = ? AND status = 'approved' FOR UPDATE",
        [eventId],
      )
      if (confirmedVolunteers.length >= event.max_volunteers) {
        const error = new Error(
          'Não há mais vagas disponíveis para este evento.',
        )
        error.status = 409
        throw error
      }

      const [existingRows] = await connection.query(
        'SELECT id, status FROM event_volunteers WHERE event_id = ? AND user_id = ? FOR UPDATE',
        [eventId, userId],
      )
      const existingRequest = existingRows[0]
      if (existingRequest && existingRequest.status !== 'rejected') {
        const error = new Error(
          'Você já possui uma solicitação ou inscrição para este evento.',
        )
        error.status = 409
        throw error
      }

      if (existingRequest) {
        await connection.query(
          "UPDATE event_volunteers SET status = 'pending', registered_at = CURRENT_TIMESTAMP WHERE id = ?",
          [existingRequest.id],
        )
        await connection.commit()
        return {id: existingRequest.id, eventId, status: 'pending'}
      } else {
        const [result] = await connection.query(
          "INSERT INTO event_volunteers (event_id, user_id, status) VALUES (?, ?, 'pending')",
          [eventId, userId],
        )
        await connection.commit()
        return {id: result.insertId, eventId, status: 'pending'}
      }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * Registra a decisão administrativa para uma solicitação pendente.
   * @param {number} requestId - Identificador da solicitação.
   * @param {'approved'|'rejected'} decision - Decisão a aplicar.
   * @returns {Promise<{id: number, eventId: number, userId: number, status: string, capacityRejected: boolean}>}
   * Solicitação analisada; `capacityRejected` indica recusa automática por falta de vagas.
   * @throws {Error} Com status 404 se a solicitação/evento não existir ou 409 se a solicitação
   * já tiver sido analisada.
   */
  async reviewRequest(requestId, decision) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [requestEvents] = await connection.query(
        'SELECT event_id FROM event_volunteers WHERE id = ? AND user_id IS NOT NULL',
        [requestId],
      )
      if (!requestEvents[0]) {
        const error = new Error('Solicitação não encontrada.')
        error.status = 404
        throw error
      }

      const [events] = await connection.query(
        'SELECT id, max_volunteers FROM events WHERE id = ? FOR UPDATE',
        [requestEvents[0].event_id],
      )
      if (!events[0]) {
        const error = new Error('Evento não encontrado.')
        error.status = 404
        throw error
      }

      const [requests] = await connection.query(
        'SELECT id, event_id, user_id, status FROM event_volunteers WHERE id = ? AND user_id IS NOT NULL FOR UPDATE',
        [requestId],
      )
      const request = requests[0]
      if (!request || request.status !== 'pending') {
        const error = new Error('Esta solicitação já foi analisada.')
        error.status = 409
        throw error
      }

      let status = decision

      if (decision === 'approved') {
        const [confirmedVolunteers] = await connection.query(
          "SELECT id FROM event_volunteers WHERE event_id = ? AND status = 'approved' FOR UPDATE",
          [request.event_id],
        )
        if (confirmedVolunteers.length >= events[0].max_volunteers) {
          status = 'rejected'
        }
      }

      await connection.query(
        'UPDATE event_volunteers SET status = ? WHERE id = ?',
        [status, requestId],
      )
      await connection.commit()

      return {
        id: request.id,
        eventId: request.event_id,
        userId: request.user_id,
        status,
        capacityRejected: decision === 'approved' && status === 'rejected',
      }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  /**
   * Lista solicitações com dados do usuário e do evento para a área administrativa.
   * @returns {Promise<Array<Object>>} Solicitações ordenadas por estado e data de registro.
   */
  async findRequestsForAdmin() {
    const [rows] = await pool.query(
      `SELECT ev.id, ev.event_id AS eventId, ev.user_id AS userId, ev.status,
              ev.registered_at AS requestedAt,
              u.name AS userName, u.email AS userEmail,
              e.title AS eventTitle, e.date AS eventDate
       FROM event_volunteers ev
       JOIN users u ON u.id = ev.user_id
       JOIN events e ON e.id = ev.event_id
       ORDER BY FIELD(ev.status, 'pending', 'rejected', 'approved'), ev.registered_at DESC`,
    )
    return rows
  }

  /**
   * Lista as solicitações pertencentes a um usuário.
   * @param {number} userId - Identificador do usuário.
   * @returns {Promise<Array<Object>>} Solicitações do usuário, da mais recente para a mais antiga.
   */
  async findRequestsByUser(userId) {
    const [rows] = await pool.query(
      `SELECT ev.id, ev.event_id AS eventId, ev.status,
              ev.registered_at AS requestedAt,
              e.title AS eventTitle
       FROM event_volunteers ev
       JOIN events e ON e.id = ev.event_id
       WHERE ev.user_id = ?
       ORDER BY ev.registered_at DESC`,
      [userId],
    )
    return rows
  }

  /**
   * Verifica se um voluntário já está inscrito em um evento específico.
   * @param {number} eventId - ID do evento.
   * @param {number} volunteerId - ID do voluntário.
   * @returns {Promise<Object|null>} Registo da inscrição ou null.
   */
  async findByEventAndVolunteer(eventId, volunteerId) {
    const [rows] = await pool.query(
      'SELECT * FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId],
    )
    return rows[0] || null
  }

  /**
   * Lista todos os voluntários inscritos em um evento.
   * @param {number} eventId - ID do evento.
   * @returns {Promise<Array>} Lista de voluntários.
   */
  async findVolunteersByEvent(eventId) {
    const [rows] = await pool.query(
      `SELECT ev.id AS registrationId, COALESCE(v.id, u.id) AS id,
              u.name, u.email, v.phone,
              v.course_or_affiliation, ev.registered_at, ev.status
       FROM event_volunteers ev
       LEFT JOIN volunteers v ON v.id = ev.volunteer_id
       LEFT JOIN users u ON u.id = COALESCE(ev.user_id, v.user_id)
       WHERE ev.event_id = ?
         AND ev.status = 'approved'
       ORDER BY ev.registered_at ASC`,
      [eventId],
    )
    return rows
  }
}

module.exports = new EventVolunteerModel()
