const pool = require('../config/database');

const Order = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT p.*, m.numero as mesa_numero FROM pedidos p LEFT JOIN mesas m ON p.mesa_id = m.id ORDER BY p.fecha DESC'
    );
    for (let pedido of rows) {
      const [items] = await pool.query(
        'SELECT dp.*, pr.nombre FROM detalle_pedidos dp JOIN productos pr ON dp.producto_id = pr.id WHERE dp.pedido_id = ?',
        [pedido.id]
      );
      pedido.items = items;
    }
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (!rows.length) return null;
    const [items] = await pool.query(
      'SELECT dp.*, pr.nombre FROM detalle_pedidos dp JOIN productos pr ON dp.producto_id = pr.id WHERE dp.pedido_id = ?',
      [id]
    );
    rows[0].items = items;
    return rows[0];
  },
};

module.exports = Order;
