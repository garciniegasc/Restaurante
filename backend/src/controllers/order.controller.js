const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
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
    res.json(rows);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    const [items] = await pool.query(
      'SELECT dp.*, pr.nombre FROM detalle_pedidos dp JOIN productos pr ON dp.producto_id = pr.id WHERE dp.pedido_id = ?',
      [req.params.id]
    );
    rows[0].items = items;
    res.json(rows[0]);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { mesa_id, items, cliente_nombre, usuario_id } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    
    const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const [result] = await conn.query(
      'INSERT INTO pedidos (mesa_id, usuario_id, cliente_nombre, total) VALUES (?, ?, ?, ?)',
      [mesa_id, usuario_id, cliente_nombre, total]
    );
    for (const item of items) {
      await conn.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [result.insertId, item.producto_id, item.cantidad, item.precio]
      );
    }
    await conn.query('UPDATE mesas SET estado = ? WHERE id = ?', ['ocupada', mesa_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, total, message: 'Pedido creado' });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);
    if (estado === 'entregado') {
      const [pedido] = await pool.query('SELECT mesa_id FROM pedidos WHERE id = ?', [req.params.id]);
      if (pedido.length) {
        await pool.query('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', pedido[0].mesa_id]);
      }
    }
    res.json({ message: 'Estado actualizado' });
  } catch (error) { next(error); }
};
