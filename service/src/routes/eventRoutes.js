/**
 * @file eventRoutes.js
 * @description Rotas de eventos da API.
 */
const { Router } = require("express");
const EventController = require("../controllers/eventController");

const router = Router();

/**
 * @swagger
 * /events/:
 *   post:
 *     summary: Lista todos os eventos
 *     tags:
 *       - Eventos
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso
 */
router.get("/", EventController.getAll);

module.exports = router;
