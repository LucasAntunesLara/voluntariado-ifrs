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
 *     requestBody:
 *       required: true
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Título do evento
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
 */
router.post("/", verifyToken, authorizeRole("admin"), EventController.create);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     tags: [Events]
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
 */
router.put("/:id", EventController.update);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
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
 *         description: Evento deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro interno ao deletar o evento.
 */
router.delete("/:id", EventController.delete);

module.exports = router;
