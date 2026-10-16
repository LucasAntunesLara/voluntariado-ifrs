/**
 * @file authRoutes.js
 * @description Rotas para autenticação de usuários, geração de token JWT e rota protegida do dashboard.
 */

const { Router } = require("express");
const {
  verifyToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const eventVolunteerController = require("../controllers/eventVolunteerController");
const authController = require("../controllers/authController");

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Rota protegida acessível apenas por usuários autenticados
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado ao painel.
 *       401:
 *         description: Token ausente ou inválido.
 */
router.get("/", verifyToken, authController.getDashboard);
router.post(
  "/admins",
  verifyToken,
  authorizeRole("admin"),
  authController.createAdmin,
);
router.get(
  "/participation-requests",
  verifyToken,
  authorizeRole("admin"),
  eventVolunteerController.listAdminRequests,
);
router.get(
  "/my-participation-requests",
  verifyToken,
  eventVolunteerController.listMyRequests,
);
router.patch(
  "/participation-requests/:requestId",
  verifyToken,
  authorizeRole("admin"),
  eventVolunteerController.reviewRequest,
);

module.exports = router;
