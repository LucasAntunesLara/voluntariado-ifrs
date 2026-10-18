/**
 * @file userModel.js
 * @description Modelo de dados para operações de usuários no MySQL.
 */
const db = require('../config/database')

class UserModel {
  /**
   * Busca um usuário pelo endereço de e-mail.
   * @param {string} email - E-mail do usuário.
   * @returns {Promise<Object|null>} Dados do usuário ou nulo.
   */
  async findByEmail(email) {
    const query =
      'SELECT id, name, email, password, role FROM users WHERE email = ?'
    const [rows] = await db.execute(query, [email])
    return rows[0] || null
  }

  async findProfileById(id) {
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.email, u.role, u.created_at AS createdAt
       FROM users u
       WHERE u.id = ?`,
      [id],
    )
    return rows[0] || null
  }

  async updateProfile(id, {name, email}) {
    const connection = await db.getConnection()
    try {
      await connection.beginTransaction()

      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ? FOR UPDATE',
        [id],
      )
      if (!users[0]) {
        const error = new Error('Conta não encontrada.')
        error.status = 404
        throw error
      }

      await connection.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  async deleteAccount(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows > 0
  }

  async createVolunteer({
    name,
    email,
    phone,
    password,
    courseOrAffiliation = 'Comunidade Externa',
  }) {
    const connection = await db.getConnection()
    try {
      await connection.beginTransaction()
      const [userResult] = await connection.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'volunteer')",
        [name, email, password],
      )
      await connection.execute(
        'INSERT INTO volunteers (user_id, phone, course_or_affiliation) VALUES (?, ?, ?)',
        [userResult.insertId, phone, courseOrAffiliation],
      )
      await connection.commit()
      return {
        id: userResult.insertId,
        name,
        email,
        role: 'volunteer',
      }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  async createAdmin({name, email, password}) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
      [name, email, password],
    )
    return {id: result.insertId, name, email, role: 'admin'}
  }
}

module.exports = new UserModel()
