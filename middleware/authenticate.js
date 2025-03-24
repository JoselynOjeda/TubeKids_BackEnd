const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "tube_kids";  // Usa la variable de entorno o fallback

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Authorization Header: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(400).send(`Invalid token: ${err.message}`);
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticate;
