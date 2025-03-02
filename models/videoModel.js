const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  url: { type: String, required: true },
  descripcion: String,
}, { timestamps: true });

module.exports = mongoose.model("Video", VideoSchema);
