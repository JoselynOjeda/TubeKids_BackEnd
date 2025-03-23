const mongoose = require('mongoose');

const restrictedUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  avatar: { type: String, required: true },
  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // opcional pero útil si luego haces populate()
    required: true
  }
});

module.exports = mongoose.model('RestrictedUser', restrictedUserSchema);
