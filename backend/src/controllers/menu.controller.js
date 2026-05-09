const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.nombre as categoria FROM productos p JOIN categorias c ON p.categoria_id = c.id'
    );
    res.json(rows);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    if (!nombre || !precio) return res.status(400).json({ error: 'Nombre y precio requeridos' });
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, categoria_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado' });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, categoria_id, disponible } = req.body;
    await pool.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria_id=?, disponible=? WHERE id=?',
      [nombre, descripcion, precio, categoria_id, disponible, req.params.id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) { next(error); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const [product] = await pool.query('SELECT disponible FROM productos WHERE id = ?', [req.params.id]);
    if (!product.length) return res.status(404).json({ error: 'Producto no encontrado' });
    await pool.query('UPDATE productos SET disponible = ? WHERE id = ?', [!product[0].disponible, req.params.id]);
    res.json({ message: 'Disponibilidad actualizada' });
  } catch (error) { next(error); }
};
