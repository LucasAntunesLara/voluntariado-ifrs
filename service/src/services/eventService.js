const EventModel = require('../models/eventModel')

class EventService {
  static async getAll() {
    return await EventModel.findAll()
  }

  static async getById(id) {
    const event = await EventModel.findById(id)
    if (!event) throw new Error('Evento não encontrado.')

    return event
  }

  static async create(event) {
    return await EventModel.create(event)
  }

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
