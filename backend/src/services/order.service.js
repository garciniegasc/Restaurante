const pool = require('../config/database');

class OrderService {
  async createOrder(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const { mesa_id, items, cliente_nombre, usuario_id } = data;
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
      return { id: result.insertId, total };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateOrderStatus(id, estado) {
    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    if (estado === 'entregado') {
      const [pedido] = await pool.query('SELECT mesa_id FROM pedidos WHERE id = ?', [id]);
      if (pedido.length) {
        await pool.query('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', pedido[0].mesa_id]);
      }
    }
  }
}

module.exports = new OrderService();
