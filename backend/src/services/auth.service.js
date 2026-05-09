const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/environment');

class AuthService {
  async authenticate(email, password) {
    const user = await User.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    const token = jwt.sign(
      { id: user.id, email: user.email, rol_id: user.rol_id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id } };
  }

  verifyToken(token) {
    try { return jwt.verify(token, JWT_SECRET); }
    catch { return null; }
  }
}

module.exports = new AuthService();
