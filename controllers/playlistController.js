// controllers/playlistController.js
const Playlist = require('../models/playlistModel');

// Crear playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name, assignedProfiles, description } = req.body;

    if (!name || !assignedProfiles || assignedProfiles.length === 0) {
      return res.status(400).json({ message: "Name and assignedProfiles are required." });
    }

    const newPlaylist = new Playlist({
      name,
      assignedProfiles,
      description,
      userId: req.user.id, // El ID del usuario que inició sesión
      videos: []
    });

    const saved = await newPlaylist.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Obtener todas las playlists del usuario
exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id });
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Editar playlist
exports.updatePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const { name, description, assignedProfiles, videos } = req.body;

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { name, description, assignedProfiles, videos },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Eliminar playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    await Playlist.findByIdAndDelete(playlistId);
    res.status(200).json({ message: "Playlist deleted." });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: "Server error." });
  }
};
