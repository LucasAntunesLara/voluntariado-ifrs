/**
 * @file swagger.js
 * @description Gera a especificação OpenAPI a partir das anotações Swagger da API.
 */

const path = require('node:path')
const process = require('node:process')
const swaggerJsdoc = require('swagger-jsdoc')

const sourcePath = path.dirname(module.filename)
const toGlobPath = filePath => filePath.replace(/\\/g, '/')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Ações de Voluntariado - IFRS',
      version: '1.0.0',
      description:
        'Documentação da API do sistema de voluntariado do IFRS Campus Bento Gonçalves',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: [
    toGlobPath(path.join(sourcePath, '..', 'app.js')),
    toGlobPath(path.join(sourcePath, '..', 'routes', '*.js')),
  ],
}

module.exports = swaggerJsdoc(swaggerOptions)
