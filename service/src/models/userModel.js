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

  /**
   * Busca os dados públicos do perfil de uma conta pelo identificador.
   * @param {number|string} id - Identificador do usuário.
   * @returns {Promise<Object|null>} Perfil encontrado ou null se a conta não existir.
   */
  async findProfileById(id) {
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.email, u.role, u.created_at AS createdAt
       FROM users u
       WHERE u.id = ?`,
      [id],
    )
    return rows[0] || null
  }

  /**
   * Atualiza o nome e o e-mail de uma conta dentro de uma transação.
   * @param {number|string} id - Identificador do usuário.
   * @param {{name: string, email: string}} profile - Dados atualizados do perfil.
   * @returns {Promise<void>} Conclui após confirmar a transação.
   * @throws {Error} Com status 404 se a conta não existir; repassa falhas de banco de dados.
   */
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

  /**
   * Exclui uma conta pelo identificador.
   * @param {number|string} id - Identificador do usuário.
   * @returns {Promise<boolean>} Indica se uma conta foi removida.
   */
  async deleteAccount(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows > 0
  }

  /**
   * Cria uma conta de voluntário e seu cadastro complementar em uma transação.
   * @param {Object} volunteer - Dados da conta e do cadastro de voluntário.
   * @param {string} volunteer.name - Nome do voluntário.
   * @param {string} volunteer.email - E-mail da conta.
   * @param {string} volunteer.phone - Telefone do voluntário.
   * @param {string} volunteer.password - Hash da senha.
   * @param {string} [volunteer.courseOrAffiliation='Comunidade Externa'] - Curso ou vínculo.
   * @returns {Promise<{id: number, name: string, email: string, role: 'volunteer'}>}
   * Dados básicos da conta criada.
   */
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

  /**
   * Cria uma conta com papel de administrador.
   * @param {{name: string, email: string, password: string}} admin - Dados da conta; senha já processada.
   * @returns {Promise<{id: number, name: string, email: string, role: 'admin'}>}
   * Dados básicos da conta criada.
   */
  async createAdmin({name, email, password}) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
      [name, email, password],
    )
    return {id: result.insertId, name, email, role: 'admin'}
  }
}

module.exports = new UserModel()
