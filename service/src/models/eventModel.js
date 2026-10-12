const db = require("../config/database");

class EventModel {
  static async create(data) {
    const { title, description, location, date, max_volunteers } = data;
    const [result] = await db.query(
      "INSERT INTO events (title, description, location, date, max_volunteers) VALUES (?, ?, ?, ?, ?)",
      [title, description, location, date, max_volunteers],
    );
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM events");

    return rows;
  }
}

module.exports = EventModel;
