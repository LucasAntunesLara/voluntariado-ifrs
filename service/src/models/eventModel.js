const db = require('../config/database')

class EventModel {
  /**
   * Insere um evento no banco de dados.
   * @param {Object} data - Dados do evento: título, descrição, local, data e limite de voluntários.
   * @returns {Promise<number>} Identificador do evento criado.
   */
  static async create(data) {
    const {title, description, location, date, max_volunteers} = data

    const [result] = await db.query(
      'INSERT INTO events (title, description, location, date, max_volunteers) VALUES (?, ?, ?, ?, ?)',
      [title, description, location, date, max_volunteers],
    )

    return result.insertId
  }

  /**
   * Busca um evento pelo identificador.
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object|undefined>} Evento encontrado ou undefined se não existir.
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id])

    return rows[0]
  }

  /**
   * Busca todos os eventos ordenados por data, incluindo a contagem de inscrições aprovadas.
   * @returns {Promise<Array<Object>>} Lista de eventos com o total de voluntários aprovados.
   */
  static async findAll() {
    const [rows] = await db.query(
      `SELECT e.*,
              (SELECT COUNT(*) FROM event_volunteers ev
               WHERE ev.event_id = e.id AND ev.status = 'approved') AS volunteers_count
       FROM events e
       ORDER BY e.date ASC`,
    )

    return rows
  }

  /**
   * Atualiza os dados de um evento.
   * @param {number|string} id - Identificador do evento.
   * @param {Object} data - Novos dados do evento: título, descrição, local, data e limite de voluntários.
   * @returns {Promise<number>} Número de linhas afetadas.
   */
  static async update(id, data) {
    const {title, description, location, date, max_volunteers} = data

    const [result] = await db.query(
      'UPDATE events SET title = ?, description = ?, location = ?, date = ?, max_volunteers = ? WHERE id = ?',
      [title, description, location, date, max_volunteers, id],
    )

    return result.affectedRows
  }

  /**
   * Exclui um evento pelo identificador.
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<number>} Número de linhas removidas.
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [id])
    return result.affectedRows
  }
}

module.exports = EventModel
