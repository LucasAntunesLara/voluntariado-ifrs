/**
 * @file app.js
 * @description Configuração principal da aplicação Express.
 */
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./config/swagger')

const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const volunteerRoutes = require('./routes/volunteerRoutes')
const eventVolunteerRoutes = require('./routes/eventVolunteerRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use('/events', eventVolunteerRoutes)
app.use('/volunteers', volunteerRoutes)
app.use('/dashboard', dashboardRoutes)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se a API está em execução
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API em execução.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API rodando com sucesso!
 */
app.get('/', (req, res) => {
  res.json({status: 'API rodando com sucesso!'})
})

module.exports = app
