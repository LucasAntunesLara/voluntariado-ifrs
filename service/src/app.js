const express = require("express");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes"); // Conforme implementado no login

const app = express();

app.use(cors());
app.use(express.json());

// Registro das rotas da API
// app.use("/auth", authRoutes);
// app.use("/events", eventRoutes);

module.exports = app;
