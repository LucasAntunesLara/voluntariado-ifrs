const EventModel = require('../models/eventModel')

class EventService {
  /**
   * Retorna todos os eventos.
   * @returns {Promise<Array<Object>>} Lista de eventos.
   */
  static async getAll() {
    return await EventModel.findAll()
  }

  /**
   * Busca um evento pelo identificador.
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object>} Evento encontrado.
   * @throws {Error} Se o evento não existir.
   */
  static async getById(id) {
    const event = await EventModel.findById(id)
    if (!event) throw new Error('Evento não encontrado.')

    return event
  }

  /**
   * Cria um evento com os dados fornecidos.
   * @param {Object} event - Dados do evento.
   * @returns {Promise<number>} Identificador do evento criado.
   */
  static async create(event) {
    return await EventModel.create(event)
  }

  /**
   * Atualiza os dados de um evento existente.
   * @param {number|string} id - Identificador do evento.
   * @param {Object} event - Novos dados do evento.
   * @returns {Promise<number>} Número de linhas atualizadas.
   * @throws {Error} Com status 404 se o evento não existir ou nenhuma linha for atualizada.
   */
  static async update(id, event) {
    const eventExists = await EventModel.findById(id)
    if (!eventExists) {
      const error = new Error('Evento não encontrado.')
      error.status = 404
      throw error
    }

    const updatedRows = await EventModel.update(id, event)
    if (updatedRows === 0) {
      const err = new Error('Evento não encontrado.')
      err.status = 404
      throw err
    }

    return updatedRows
  }

  /**
   * Exclui um evento existente.
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<number>} Número de linhas removidas.
   * @throws {Error} Com status 404 se o evento não existir.
   */
  static async delete(id) {
    const deletedRows = await EventModel.delete(id)

    if (deletedRows === 0) {
      const error = new Error('Evento não encontrado.')
      error.status = 404
      throw error
    }

    return deletedRows
  }
}

module.exports = EventService
