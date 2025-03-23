const express = require('express');
const router = express.Router();
const restrictedUserController = require('../controllers/restrictedUserController');

// Obtener todos los perfiles restringidos
router.get('/', restrictedUserController.getAllRestrictedUsers);

// Añadir un perfil restringido
router.post('/', restrictedUserController.addRestrictedUser);

// Actualizar un perfil restringido
router.put('/:id', restrictedUserController.updateRestrictedUser);

// Eliminar un perfil restringido
router.delete('/:id', restrictedUserController.deleteRestrictedUser);

module.exports = router;
