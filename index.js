const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Permitir peticiones solo desde el front-end
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error conectando a MongoDB:", err));

// Importar rutas
const userRoutes = require("./routes/userRoutes"); // Asumiendo que este archivo maneja registro y login
const videoRoutes = require("./routes/videoRoutes");

// Usar rutas

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
