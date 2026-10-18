/**
 * @file app.js
 * @description Configuração principal da aplicação Express.
 */
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const volunteerRoutes = require('./routes/volunteerRoutes')
const eventVolunteerRoutes = require('./routes/eventVolunteerRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors())
app.use(express.json())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Ações de Voluntariado - IFRS',
      version: '1.0.0',
      description:
        'Documentação da API do sistema de voluntariado do IFRS Campus Bento Gonçalves',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use('/events', eventVolunteerRoutes)
app.use('/volunteers', volunteerRoutes)
app.use('/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
  res.json({status: 'API rodando com sucesso!'})
})

module.exports = app
