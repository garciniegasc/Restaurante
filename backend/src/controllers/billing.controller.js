const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM facturas ORDER BY fecha DESC');
    res.json(rows);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM facturas WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { pedido_id, metodo_pago, cliente_nombre } = req.body;
    if (!pedido_id || !metodo_pago) {
      return res.status(400).json({ error: 'Pedido y método de pago requeridos' });
    }
    const [pedido] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [pedido_id]);
    if (!pedido.length) return res.status(404).json({ error: 'Pedido no encontrado' });

    const subtotal = parseFloat(pedido[0].total);
    const impuesto = Math.round(subtotal * 0.19 * 100) / 100;
    const total = subtotal + impuesto;

    const [result] = await pool.query(
      'INSERT INTO facturas (pedido_id, subtotal, impuesto, total, metodo_pago, cliente_nombre) VALUES (?, ?, ?, ?, ?, ?)',
      [pedido_id, subtotal, impuesto, total, metodo_pago, cliente_nombre]
    );
    res.status(201).json({ id: result.insertId, total, message: 'Factura generada' });
  } catch (error) { next(error); }
};
