const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservas ORDER BY fecha DESC, hora DESC');
    res.json(rows);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { cliente_nombre, cliente_email, fecha, hora, personas, notas, usuario_id, mesa_id } = req.body;
    if (!cliente_nombre || !fecha || !hora) {
      return res.status(400).json({ error: 'Nombre, fecha y hora requeridos' });
    }
    const [result] = await pool.query(
      'INSERT INTO reservas (cliente_nombre, cliente_email, fecha, hora, personas, notas, usuario_id, mesa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cliente_nombre, cliente_email, fecha, hora, personas, notas, usuario_id, mesa_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Reserva creada' });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    await pool.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ message: 'Estado actualizado' });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM reservas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Reserva eliminada' });
  } catch (error) { next(error); }
};
