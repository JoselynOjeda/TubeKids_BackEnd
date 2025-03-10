const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt to hash passwords

// Función para generar JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '90d' });
};

// Registro de usuario
exports.signup = async (req, res) => {
  const { email, password, phone, pin, name, surname, country, birthDate } = req.body;

  // Verificar edad del usuario
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  if (age < 18) {
    return res.status(400).json({ message: 'You must be at least 18 years old to register.' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hashear la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("🔐 Contraseña original:", password);
    console.log("🧂 Salt generado:", salt);
    console.log("🔒 Contraseña hasheada:", hashedPassword);

    // Crear nuevo usuario
    const newUser = await User.create({
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
      phone,
      pin,
      name,
      surname,
      country,
      birthDate
    });

    // Generar token JWT
    const token = generateToken(newUser._id);

    console.log("✅ Usuario registrado con éxito:", email);

    // Responder con éxito sin incluir la contraseña
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          surname: newUser.surname,
          phone: newUser.phone,
          country: newUser.country,
          birthDate: newUser.birthDate,
        }
      }
    });
  } catch (error) {
    console.error("❌ Error durante el registro:", error);
    res.status(500).json({ message: 'Error signing up user', error });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("⚠️ Falta email o contraseña en la solicitud.");
    return res.status(400).json({ message: 'Please provide email and password!' });
  }

  try {
    console.log(`🔍 Buscando usuario con email: ${email}`);

    // Buscar usuario y recuperar contraseña
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    console.log("🟢 Usuario encontrado:", user.email);
    console.log("🔑 Contraseña ingresada:", password);
    console.log("🔒 Contraseña almacenada (hash en la BD):", user.password);

    // Comparar la contraseña ingresada con el hash almacenado en la BD
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("❌ Error comparando contraseñas:", err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      console.log(`🔄 Comparación bcrypt: ${isMatch}`);

      if (!isMatch) {
        console.log("❌ Contraseña incorrecta");
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      console.log("✅ Contraseña correcta, generando token...");

      // Generar token JWT
      const token = generateToken(user._id);

      console.log("🔐 Token generado:", token);

      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            country: user.country,
            birthDate: user.birthDate,
          }
        }
      });
    });

  } catch (error) {
    console.error("❌ Error durante el login:", error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};
