const EventModel = require("../models/eventModel");
const EventVolunteerModel = require("../models/eventVolunteerModel");

/**
 * Aplica as regras de negócio antes de persistir os dados do evento.
 * @param {Object} event - Dados do evento recebidos pela API.
 * @returns {Object} Campos do evento validados.
 * @throws {Error} Se faltar um campo obrigatório ou se o limite for inválido.
 */
function validateEvent(event) {
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    const error = new Error("Informe os dados do evento.");
    error.status = 400;
    throw error;
  }

  const stringFields = ["title", "description", "location"];
  const normalizedEvent = {};

  for (const field of stringFields) {
    if (typeof event[field] !== "string" || !event[field].trim()) {
      const error = new Error(`O campo ${field} é obrigatório.`);
      error.status = 400;
      throw error;
    }
    normalizedEvent[field] = event[field].trim();
  }

  if (
    typeof event.date !== "string" ||
    !event.date.trim() ||
    Number.isNaN(Date.parse(event.date))
  ) {
    const error = new Error("Informe uma data válida para o evento.");
    error.status = 400;
    throw error;
  }

  const maxVolunteers = Number(event.max_volunteers);
  if (!Number.isInteger(maxVolunteers) || maxVolunteers < 1) {
    const error = new Error(
      "O limite de voluntários deve ser um inteiro positivo.",
    );
    error.status = 400;
    throw error;
  }

  return {
    ...normalizedEvent,
    date: event.date,
    max_volunteers: maxVolunteers,
  };
}

/** Aplica as regras de consulta e gerenciamento de eventos. */
class EventService {
  /** @returns {Promise<Array<Object>>} Eventos ordenados por data. */
  static async getAll() {
    return EventModel.findAll();
  }

  /**
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object>} Evento correspondente.
   * @throws {Error} Com status 404 se o evento não existir.
   */
  static async getById(id) {
    const event = await EventModel.findById(id);
    if (!event) {
      const error = new Error("Evento não encontrado.");
      error.status = 404;
      throw error;
    }

    return event;
  }

  /**
   * @param {Object} event - Dados do evento a validar e persistir.
   * @returns {Promise<number>} Identificador do evento criado.
   */
  static async create(event) {
    return EventModel.create(validateEvent(event));
  }

  /**
   * Substitui os dados do evento sem reduzir sua capacidade abaixo das
   * inscrições confirmadas.
   * @param {number|string} id - Identificador do evento.
   * @param {Object} event - Dados completos do evento.
   * @returns {Promise<number>} Quantidade de linhas atualizadas.
   * @throws {Error} Com status 404 ou 409 se a operação não puder ser feita.
   */
  static async update(id, event) {
    await this.getById(id);

    const validatedEvent = validateEvent(event);
    const confirmedVolunteers = await EventVolunteerModel.countByEvent(id);
    if (validatedEvent.max_volunteers < Number(confirmedVolunteers)) {
      const error = new Error(
        "O limite não pode ser menor que o número de voluntários confirmados.",
      );
      error.status = 409;
      throw error;
    }

    const updatedRows = await EventModel.update(id, validatedEvent);
    if (updatedRows === 0) {
      const error = new Error("Evento não encontrado.");
      error.status = 404;
      throw error;
    }

    return updatedRows;
  }

  /**
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<number>} Quantidade de linhas excluídas.
   * @throws {Error} Com status 404 se o evento não existir.
   */
  static async delete(id) {
    await this.getById(id);
    const deletedRows = await EventModel.delete(id);

    if (deletedRows === 0) {
      const error = new Error("Evento não encontrado.");
      error.status = 404;
      throw error;
    }

    return deletedRows;
  }
}

module.exports = EventService;
