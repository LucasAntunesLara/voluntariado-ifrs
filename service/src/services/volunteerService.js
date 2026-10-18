/**
 * @file volunteerService.js
 * @description Camada de Service para regras de negócio de voluntários.
 */

const VolunteerModel = require("../models/volunteerModel");

class VolunteerService {
  /**
   * Retorna a lista de todos os voluntários.
   * @returns {Promise<Array>}
   */
  async getAllVolunteers() {
    return await VolunteerModel.findAll();
  }

  /**
   * Retorna um voluntário pelo ID.
   * @returns {Promise<Array>}
   */
  /**
   * @param {number|string} id - Volunteer identifier.
   * @returns {Promise<Object>} Matching volunteer.
   * @throws {Error} If the volunteer does not exist.
   */
  async getById(id) {
    const volunteer = await VolunteerModel.findById(id);

    if (!volunteer) throw new Error("Voluntário não encontrado.");

    return volunteer;
  }

  /**
   * Processa o cadastro de um novo voluntário.
   * @param {Object} volunteerData - Dados do voluntário.
   * @returns {Promise<Object>} Voluntário cadastrado.
   * @throws {Error} Se faltarem campos ou se o e-mail já estiver cadastrado.
   */
  async create(volunteerData) {
    const { name, email, phone, courseOrAffiliation } = volunteerData;

    if (!name || !email || !phone) {
      throw new Error("Nome, e-mail e telefone são obrigatórios.");
    }

    const existingVolunteer = await VolunteerModel.findByEmail(email);
    if (existingVolunteer) {
      throw new Error("Já existe um voluntário cadastrado com este e-mail.");
    }

    const volunteerId = await VolunteerModel.create({
      name,
      email,
      phone,
      courseOrAffiliation,
    });

    return await VolunteerModel.findById(volunteerId);
  }

  /**
   * Atualiza os dados de um voluntário existente.
   * @param {number} id - ID do voluntário.
   * @param {Object} volunteerData - Dados a atualizar.
   * @returns {Promise<Object>} Voluntário atualizado.
   * @throws {Error} Se o voluntário não for encontrado ou e-mail duplicado.
   */
  async update(id, volunteerData) {
    const { name, email, phone, courseOrAffiliation } = volunteerData;

    const existingVolunteer = await VolunteerModel.findById(id);
    if (!existingVolunteer) {
      throw new Error("Voluntário não encontrado.");
    }

    if (email && email !== existingVolunteer.email) {
      const emailInUse = await VolunteerModel.findByEmail(email);
      if (emailInUse) {
        throw new Error(
          "O e-mail informado já está a ser utilizado por outro voluntário.",
        );
      }
    }

    await VolunteerModel.update(id, {
      name: name || existingVolunteer.name,
      email: email || existingVolunteer.email,
      phone: phone || existingVolunteer.phone,
      courseOrAffiliation:
        courseOrAffiliation || existingVolunteer.course_or_affiliation,
    });

    return await VolunteerModel.findById(id);
  }

  /**
   * Remove um voluntário pelo ID.
   * @param {number} id - ID do voluntário.
   * @returns {Promise<boolean>}
   * @throws {Error} Se o voluntário não existir.
   */
  async delete(id) {
    const existingVolunteer = await VolunteerModel.findById(id);
    if (!existingVolunteer) {
      throw new Error("Voluntário não encontrado.");
    }

    return await VolunteerModel.delete(id);
  }
}

module.exports = new VolunteerService();
