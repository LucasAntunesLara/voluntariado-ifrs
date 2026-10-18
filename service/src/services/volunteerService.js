/**
 * @file volunteerService.js
 * @description Camada de Service para regras de negócio de voluntários.
 */

const VolunteerModel = require('../models/volunteerModel')
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs')

class VolunteerService {
  /**
   * Retorna a lista de todos os voluntários.
   * @returns {Promise<Array>}
   */
  async getAllVolunteers() {
    return await VolunteerModel.findAll()
  }

  /**
   * Retorna um voluntário pelo ID.
   * @returns {Promise<Array>}
   */
  async getById(id) {
    const event = await VolunteerModel.findById(id)

    if (!event) throw new Error('Voluntário não encontrado.')

    return event
  }

  /**
   * Processa o cadastro de um novo voluntário.
   * @param {Object} volunteerData - Dados do voluntário.
   * @returns {Promise<Object>} Voluntário cadastrado.
   * @throws {Error} Se faltarem campos ou se o e-mail já estiver cadastrado.
   */
  async create(volunteerData) {
    const {name, email, phone, password, courseOrAffiliation} = volunteerData

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof phone !== 'string' ||
      !phone.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      throw new Error('Nome, e-mail, telefone e senha são obrigatórios.')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error('Informe um e-mail válido.')
    }
    if (password.length < 8) {
      throw new Error('A senha deve ter pelo menos 8 caracteres.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (await UserModel.findByEmail(normalizedEmail)) {
      const error = new Error('Já existe uma conta com este e-mail.')
      error.status = 409
      throw error
    }

    let user
    try {
      user = await UserModel.createVolunteer({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password: await bcrypt.hash(password, 10),
        courseOrAffiliation:
          typeof courseOrAffiliation === 'string'
            ? courseOrAffiliation.trim() || 'Comunidade Externa'
            : 'Comunidade Externa',
      })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const conflictError = new Error('Já existe uma conta com este e-mail.')
        conflictError.status = 409
        throw conflictError
      }
      throw error
    }

    const volunteer = await VolunteerModel.findByUserId(user.id)
    return await VolunteerModel.findById(volunteer.id)
  }

  /**
   * Atualiza os dados de um voluntário existente.
   * @param {number} id - ID do voluntário.
   * @param {Object} volunteerData - Dados a atualizar.
   * @returns {Promise<Object>} Voluntário atualizado.
   * @throws {Error} Se o voluntário não for encontrado ou e-mail duplicado.
   */
  async update(id, volunteerData) {
    const {name, email, phone, courseOrAffiliation} = volunteerData

    const existingVolunteer = await VolunteerModel.findById(id)
    if (!existingVolunteer) {
      throw new Error('Voluntário não encontrado.')
    }

    const normalizedEmail = email?.trim().toLowerCase()
    if (normalizedEmail && normalizedEmail !== existingVolunteer.email) {
      const emailInUse = await VolunteerModel.findByEmail(normalizedEmail)
      const accountInUse = await UserModel.findByEmail(normalizedEmail)
      if (emailInUse || accountInUse) {
        throw new Error(
          'O e-mail informado já está a ser utilizado por outra conta.',
        )
      }
    }

    await VolunteerModel.update(id, {
      name: name?.trim() || existingVolunteer.name,
      email: normalizedEmail || existingVolunteer.email,
      phone: phone || existingVolunteer.phone,
      courseOrAffiliation:
        courseOrAffiliation?.trim() ||
        existingVolunteer.course_or_affiliation,
    })

    return await VolunteerModel.findById(id)
  }

  /**
   * Remove um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<boolean>}
   * @throws {Error} Se o voluntário não existir.
   */
  async delete(id) {
    const existingVolunteer = await VolunteerModel.findById(id)
    if (!existingVolunteer) {
      throw new Error('Voluntário não encontrado.')
    }

    return await VolunteerModel.delete(id)
  }
}

module.exports = new VolunteerService()
