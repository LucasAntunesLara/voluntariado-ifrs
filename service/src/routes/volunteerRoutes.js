/**
 * @file volunteerRoutes.js
 * @description Rotas para o gerenciamento de voluntários
 */

const {Router} = require('express')
const VolunteerController = require('../controllers/volunteerController')
const {verifyToken, authorizeRole} = require('../middlewares/authMiddleware')

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Volunteers
 *   description: Gerenciamento de voluntários
 */

/**
 * @swagger
 * /volunteers:
 *   get:
 *     summary: Retorna a lista de voluntários (apenas administradores)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de voluntários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', verifyToken, authorizeRole('admin'), VolunteerController.getAll)

/**
 * @swagger
 * /volunteers/{id}:
 *   get:
 *     summary: Retorna um voluntário pelo ID (apenas administradores)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voluntário
 *     responses:
 *       200:
 *         description: voluntário encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: voluntário não encontrado.
 */
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  VolunteerController.getById,
)

/**
 * @swagger
 * /volunteers:
 *   post:
 *     summary: Cria um cadastro de voluntário (apenas administradores)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - phone
 *                 - password
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phone:
 *                   type: string
 *                 password:
 *                   type: string
 *                   minLength: 8
 *                 courseOrAffiliation:
 *                   type: string
 *                   description: Curso ou vínculo do voluntário
 *     responses:
 *       201:
 *         description: voluntário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: Já existe uma conta com este e-mail.
 */
router.post(
  '/',
  verifyToken,
  authorizeRole('admin'),
  VolunteerController.create,
)

/**
 * @swagger
 * /volunteers/{id}:
 *   put:
 *     summary: Atualiza um cadastro de voluntário (apenas administradores)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voluntário
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *     responses:
 *       200:
 *         description: voluntário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou erro na atualização.
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  VolunteerController.update,
)

/**
 * @swagger
 * /volunteers/{id}:
 *   delete:
 *     summary: Remove um cadastro de voluntário (apenas administradores)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voluntário
 *     responses:
 *       204:
 *         description: Voluntário removido com sucesso.
 *       500:
 *         description: Erro interno ao deletar o voluntário.
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  VolunteerController.remove,
)

module.exports = router
