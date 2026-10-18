const db = require("../config/database");

class EventModel {
  /**
   * Insere um evento no MySQL.
   * @param {Object} data - Campos validados do evento.
   * @returns {Promise<number>} Identificador do evento criado.
   */
  static async create(data) {
    const { title, description, location, date, max_volunteers } = data;

    const [result] = await db.query(
      "INSERT INTO events (title, description, location, date, max_volunteers) VALUES (?, ?, ?, ?, ?)",
      [title, description, location, date, max_volunteers],
    );

    return result.insertId;
  }

  /**
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object|null>} Registro encontrado ou nulo.
   */
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    return rows[0];
  }

  /** @returns {Promise<Array<Object>>} Eventos e inscrições confirmadas. */
  static async findAll() {
    const [rows] = await db.query(
      `SELECT e.*,
              (SELECT COUNT(*) FROM event_volunteers ev
               WHERE ev.event_id = e.id AND ev.status = 'approved') AS volunteers_count
       FROM events e
       ORDER BY e.date ASC`,
    );

    return rows;
  }

  /**
   * Substitui os campos persistidos de um evento.
   * @param {number|string} id - Identificador do evento.
   * @param {Object} data - Campos validados para substituição.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  static async update(id, data) {
    const { title, description, location, date, max_volunteers } = data;

    const [result] = await db.query(
      "UPDATE events SET title = ?, description = ?, location = ?, date = ?, max_volunteers = ? WHERE id = ?",
      [title, description, location, date, max_volunteers, id],
    );

    return result.affectedRows;
  }

  /**
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<number>} Quantidade de linhas excluídas.
   */
  static async delete(id) {
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = EventModel;
