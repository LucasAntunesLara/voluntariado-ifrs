/**
 * @file eventRoutes.js
 * @description Rotas para o gerenciamento de eventos
 */

const { Router } = require("express");
const EventController = require("../controllers/eventController");
const { verifyToken, authorizeRole } = require("../middlewares/authMiddleware");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gerenciamento de eventos
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna a lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", EventController.getAll);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Evento não encontrado.
 */
router.get("/:id", EventController.getById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - description
 *                 - location
 *                 - date
 *                 - max_volunteers
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Título do evento
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 max_volunteers:
 *                   type: integer
 *                   minimum: 1
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
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
 *       401:
 *         description: Token de autenticação não fornecido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 */
router.post("/", verifyToken, authorizeRole("admin"), EventController.create);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente (apenas administradores)
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou erro na atualização.
 *       401:
 *         description: Token de autenticação não fornecido.
 *       403:
 *         description: Acesso negado ou token inválido.
 *       404:
 *         description: Evento não encontrado.
 */
router.put("/:id", verifyToken, authorizeRole("admin"), EventController.update);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Cancela um evento pelo ID (apenas administradores)
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento cancelado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Token de autenticação não fornecido.
 *       403:
 *         description: Acesso negado ou token inválido.
 *       404:
 *         description: Evento não encontrado.
 */
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  EventController.delete,
);

module.exports = router;
