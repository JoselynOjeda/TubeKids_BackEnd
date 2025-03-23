const RestrictedUser = require('../models/restrictedModel');

// Obtener todos los perfiles restringidos de un usuario principal
exports.getAllRestrictedUsers = async (req, res) => {
  try {
    const restrictedUsers = await RestrictedUser.find({ parentUser: req.user.id });
    res.status(200).json(restrictedUsers);
  } catch (error) {
    console.error("Failed to retrieve restricted users:", error);
    res.status(500).json({ message: 'Error retrieving restricted users', error: error.message });
  }
};

// Añadir un perfil restringido
exports.addRestrictedUser = async (req, res) => {
  console.log("🔐 User from token:", req.user);
  const { name, pin, avatar } = req.body;
  if (!name || !pin || !avatar) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const newRestrictedUser = new RestrictedUser({
      name,
      pin,
      avatar,
      parentUser: req.user.id  // Asegúrate de que `req.user._id` está disponible, gestionado normalmente por un middleware de autenticación
    });
    await newRestrictedUser.save();
    res.status(201).json(newRestrictedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating a restricted user', error });
  }
};

// Actualizar un perfil restringido
exports.updateRestrictedUser = async (req, res) => {
  const { id } = req.params;
  const { name, pin, avatar } = req.body;

  if (!name || !pin || !avatar) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const updatedUser = await RestrictedUser.findByIdAndUpdate(
      id,
      { name, pin, avatar },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Restricted user not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating restricted user:", error);
    res.status(500).json({ message: 'Error updating restricted user', error });
  }
};
// Eliminar un perfil restringido
exports.deleteRestrictedUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await RestrictedUser.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Restricted user not found." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restricted user', error });
  }
};
