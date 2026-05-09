const pool = require('../config/database');

const Invoice = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM facturas ORDER BY fecha DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM facturas WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO facturas (pedido_id, subtotal, impuesto, total, metodo_pago, cliente_nombre) VALUES (?, ?, ?, ?, ?, ?)',
      [data.pedido_id, data.subtotal, data.impuesto, data.total, data.metodo_pago, data.cliente_nombre]
    );
    return result.insertId;
  },
};

module.exports = Invoice;
