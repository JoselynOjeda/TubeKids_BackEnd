const Video = require("../models/videoModel");

// Obtener todos los videos
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find({ userId: req.user.id });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un video por ID
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: "Video no encontrado" });
        res.json(video);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Crear un nuevo video
const createVideo = async (req, res) => {
    try {
      const { name, url, description, thumbnail } = req.body;
  
      if (!name || !url) {
        return res.status(400).json({ message: "Name and URL are required." });
      }
  
      const newVideo = new Video({
        userId: req.user.id, // Viene del middleware de autenticación
        name,
        url,
        description,
        thumbnail
      });
  
      const savedVideo = await newVideo.save();
      res.status(201).json(savedVideo);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Server error." });
    }
  };

// Actualizar un video por ID
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url, description, thumbnail } = req.body;

        if (!name || !url) {
            return res.status(400).json({ error: "El nombre y la URL son obligatorios." });
        }

        const video = await Video.findByIdAndUpdate(
            id,
            { name, url, description, thumbnail },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ error: "Video no encontrado" });
        }

        res.json(video);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Eliminar un video por ID
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) return res.status(404).json({ error: "Video no encontrado" });
        res.json({ mensaje: "Video eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getVideos, createVideo, updateVideo, deleteVideo, getVideoById };
