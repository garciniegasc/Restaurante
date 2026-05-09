const pool = require('../config/database');

const Product = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT p.*, c.nombre as categoria FROM productos p JOIN categorias c ON p.categoria_id = c.id'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
  },

  async findByCategory(categoriaId) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE categoria_id = ?', [categoriaId]);
    return rows;
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',
      [data.nombre, data.descripcion, data.precio, data.categoria_id]
    );
    return result.insertId;
  },

  async update(id, data) {
    await pool.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria_id=?, disponible=? WHERE id=?',
      [data.nombre, data.descripcion, data.precio, data.categoria_id, data.disponible, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
  },

  async toggleAvailability(id) {
    const [product] = await pool.query('SELECT disponible FROM productos WHERE id = ?', [id]);
    if (!product.length) return null;
    await pool.query('UPDATE productos SET disponible = ? WHERE id = ?', [!product[0].disponible, id]);
    return { id, disponible: !product[0].disponible };
  },
};

module.exports = Product;
