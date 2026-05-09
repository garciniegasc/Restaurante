const pool = require('../config/database');

exports.dailySales = async (req, res, next) => {
  try {
    const { fecha } = req.query;
    const [rows] = await pool.query(
      `SELECT DATE(fecha) as dia, COUNT(*) as total_facturas, SUM(total) as total_ventas
       FROM facturas WHERE estado = 'pagada' ${fecha ? 'AND DATE(fecha) = ?' : 'AND DATE(fecha) = CURDATE()'}
       GROUP BY DATE(fecha)`,
      fecha ? [fecha] : []
    );
    res.json(rows);
  } catch (error) { next(error); }
};

exports.productSales = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT pr.nombre, SUM(dp.cantidad) as cantidad_vendida, SUM(dp.subtotal) as total
       FROM detalle_pedidos dp JOIN productos pr ON dp.producto_id = pr.id
       GROUP BY pr.id, pr.nombre ORDER BY cantidad_vendida DESC`
    );
    res.json(rows);
  } catch (error) { next(error); }
};

exports.revenue = async (req, res, next) => {
  try {
    const { desde, hasta } = req.query;
    let query = `SELECT DATE(fecha) as dia, SUM(total) as ingresos FROM facturas WHERE estado = 'pagada'`;
    const params = [];
    if (desde) { query += ' AND fecha >= ?'; params.push(desde); }
    if (hasta) { query += ' AND fecha <= ?'; params.push(hasta); }
    query += ' GROUP BY DATE(fecha) ORDER BY dia';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) { next(error); }
};

exports.cashSummary = async (req, res, next) => {
  try {
    const [metodos] = await pool.query(
      `SELECT metodo_pago, COUNT(*) as cantidad, SUM(total) as total
       FROM facturas WHERE estado = 'pagada' AND DATE(fecha) = CURDATE() GROUP BY metodo_pago`
    );
    const [totals] = await pool.query(
      `SELECT COUNT(*) as total_facturas, SUM(total) as total_ingresos, SUM(impuesto) as total_impuesto
       FROM facturas WHERE estado = 'pagada' AND DATE(fecha) = CURDATE()`
    );
    res.json({ metodos, resumen: totals[0] });
  } catch (error) { next(error); }
};
