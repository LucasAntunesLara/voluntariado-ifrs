/**
 * @file dashboardModel.js
 * @description Consultas agregadas para os indicadores do painel.
 */

const db = require('../config/database')

class DashboardModel {
  async getSummary() {
    const [rows] = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM events WHERE date >= CURRENT_TIMESTAMP) AS activeCampaigns,
         (SELECT COUNT(DISTINCT v.user_id)
          FROM volunteers v
          JOIN users u ON u.id = v.user_id
          WHERE u.role = 'volunteer') AS totalVolunteersRegistered`,
    )

    return rows[0]
  }
}

module.exports = new DashboardModel()
