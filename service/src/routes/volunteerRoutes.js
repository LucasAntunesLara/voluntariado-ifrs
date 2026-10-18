/**
 * @file volunteerRoutes.js
 * @description Rotas para o gerenciamento de voluntários
 */

const { Router } = require("express");
const VolunteerController = require("../controllers/volunteerController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

const router = Router();

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
 *     summary: Retorna a lista de todos os voluntários
 *     tags: [Volunteers]
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Token de autenticação não fornecido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 */
router.get(
  "/",
  verifyToken,
  authorizeRole("admin"),
  VolunteerController.getAll,
);

/**
 * @swagger
 * /volunteers/{id}:
 *   get:
 *     summary: Retorna um voluntário pelo ID
 *     tags: [Volunteers]
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
router.get("/:id", VolunteerController.getById);

/**
 * @swagger
 * /volunteers:
 *   post:
 *     summary: Cria um novo voluntário
 *     tags: [Volunteers]
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
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phone:
 *                   type: string
 *                 courseOrAffiliation:
 *                   type: string
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
 *         description: Já existe um voluntário com este e-mail.
 */
router.post("/", VolunteerController.create);

/**
 * @swagger
 * /volunteers/{id}:
 *   put:
 *     summary: Atualiza um voluntário existente
 *     tags: [Volunteers]
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
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phone:
 *                   type: string
 *                 courseOrAffiliation:
 *                   type: string
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
router.put("/:id", VolunteerController.update);

/**
 * @swagger
 * /volunteers/{id}:
 *   delete:
 *     summary: Remove um voluntário pelo ID
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voluntário
 *     responses:
 *       200:
 *         description: voluntário deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno ao deletar o voluntário.
 */
router.delete("/:id", VolunteerController.remove);

module.exports = router;
