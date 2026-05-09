const pool = require('../config/database');

const User = {
  async findAll() {
    const [rows] = await pool.query('SELECT id, nombre, email, rol_id, activo, created_at FROM usuarios');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, nombre, email, rol_id, activo, created_at FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)',
      [data.nombre, data.email, data.password, data.rol_id]
    );
    return result.insertId;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    if (data.nombre) { fields.push('nombre = ?'); values.push(data.nombre); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.rol_id) { fields.push('rol_id = ?'); values.push(data.rol_id); }
    if (data.activo !== undefined) { fields.push('activo = ?'); values.push(data.activo); }
    if (fields.length === 0) return;
    values.push(id);
    await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  },
};

module.exports = User;
