const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * Especificação OpenAPI gerada a partir das anotações Swagger das rotas.
 */
module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestão de Ações de Voluntariado - IFRS",
      version: "1.0.0",
      description:
        "API do sistema de voluntariado do IFRS Campus Bento Gonçalves.",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")],
});
