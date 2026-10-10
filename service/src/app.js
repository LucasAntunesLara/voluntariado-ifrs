const express = require("express");

const swaggerUi = require("swagger-ui-express");

const specification = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const eventsRoutes = require("./routes/events.routes");
const volunteersRoutes = require("./routes/volunteers.routes");

const app = express();

app.use(express.json());

app.get("/openapi.json", (req, res) => {
  res.json(specification);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specification));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/volunteers", volunteersRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint não encontrado.",
  });
});

module.exports = app;
