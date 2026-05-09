const pool = require('../config/database');

const Reservation = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM reservas ORDER BY fecha DESC, hora DESC');
    return rows;
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO reservas (cliente_nombre, cliente_email, fecha, hora, personas, notas, usuario_id, mesa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.cliente_nombre, data.cliente_email, data.fecha, data.hora, data.personas, data.notas, data.usuario_id, data.mesa_id]
    );
    return result.insertId;
  },

  async updateStatus(id, estado) {
    await pool.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, id]);
  },

  async delete(id) {
    await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
  },
};

module.exports = Reservation;
