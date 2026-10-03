const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const queriesRoutes = require("./routes/queries");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/queries", queriesRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API MongoDB Examen BIGDATA",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      queries: {
        "2.1": "GET /api/queries/2-1/aeropuertos?pais=SPAIN",
        "2.2": "GET /api/queries/2-2/desempeno-mensual",
        "2.3": "GET /api/queries/2-3/rutas-rentables",
        "2.4": "GET /api/queries/2-4/ranking-mensual",
        "3.1": "GET /api/queries/3-1/precio-por-tipo",
        "3.2": "GET /api/queries/3-2/anuncios-filtrados?amenities=5&rating=90",
        "3.3": "GET /api/queries/3-3/top-revisores?top=5",
        "3.4": "GET /api/queries/3-4/buscar-en-resenas?q=Great Location"
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

start();