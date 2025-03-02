const Video = require("../models/videoModel");

// Obtener todos los videos
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find();
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
        const nuevoVideo = new Video(req.body);
        await nuevoVideo.save();
        res.status(201).json(nuevoVideo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Actualizar un video por ID
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID desde la URL
        const { nombre, url, descripcion } = req.body;

        if (!nombre || !url) {
            return res.status(400).json({ error: "El nombre y la URL son obligatorios." });
        }

        const video = await Video.findByIdAndUpdate(id, { nombre, url, descripcion }, { new: true });

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
