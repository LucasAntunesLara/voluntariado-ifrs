const EventModel = require("../models/eventModel");

class EventService {
  static async getAll() {
    return await EventModel.findAll();
  }
}

module.exports = EventService;
