App.registerPage('orders', {
  title: 'Pedidos',
  allowedRoles: ['admin', 'mesero', 'cliente'],

  render(container) {
    const user = Auth.getUser();
    const pedidos = DB.get('pedidos') || [];
    const mesas = DB.get('mesas') || [];

    const misPedidos = user.rol === 'cliente'
      ? pedidos.filter(p => p.clienteId === user.id)
      : pedidos;

    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-sm btn-primary" onclick="OrdersPage.filter('all')" data-filter="all">Todos</button>
          <button class="btn btn-sm btn-outline" onclick="OrdersPage.filter('pendiente')" data-filter="pendiente">Pendientes</button>
          <button class="btn btn-sm btn-outline" onclick="OrdersPage.filter('preparacion')" data-filter="preparacion">En Preparación</button>
          <button class="btn btn-sm btn-outline" onclick="OrdersPage.filter('entregado')" data-filter="entregado">Entregados</button>
        </div>
        ${user.rol !== 'cliente' ? '<button class="btn btn-primary" onclick="OrdersPage.create()">+ Nuevo Pedido</button>' : ''}
      </div>
      <div class="card">
        <div class="card-header"><h2>📝 Lista de Pedidos</h2></div>
        <div class="card-body card-body-inner">
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th>#</th>
                <th>Mesa</th>
                <th>Cliente</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr></thead>
              <tbody id="orders-body">
                ${OrdersPage.renderRows(misPedidos, mesas)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderRows(pedidos, mesas) {
    if (!pedidos.length) return '<tr><td colspan="8" class="text-center text-muted">No hay pedidos</td></tr>';
    return pedidos.slice().reverse().map(p => {
      const mesa = mesas.find(m => m.id === p.mesaId);
      const badgeClass = { pendiente: 'warning', preparacion: 'info', entregado: 'success' }[p.estado] || 'secondary';
      return `<tr data-estado="${p.estado}">
        <td><strong>#${p.id}</strong></td>
        <td>${mesa ? `Mesa ${mesa.numero}` : '—'}</td>
        <td>${p.clienteNombre || '—'}</td>
        <td>${(p.items || []).length} items</td>
        <td><strong>$${(p.total || 0).toLocaleString()}</strong></td>
        <td><span class="badge badge-${badgeClass}">${p.estado}</span></td>
        <td>${new Date(p.fecha).toLocaleString('es-CO')}</td>
        <td class="actions">
          ${OrdersPage.getActions(p)}
        </td>
      </tr>`;
    }).join('');
  },

  getActions(p) {
    const user = Auth.getUser();
    let html = `<button class="btn btn-sm btn-outline" onclick="OrdersPage.view(${p.id})">👁️</button>`;
    if (user.rol === 'admin' || user.rol === 'mesero') {
      if (p.estado === 'pendiente') {
        html += ` <button class="btn btn-sm btn-info" onclick="OrdersPage.updateStatus(${p.id},'preparacion')">👨‍🍳 Cocina</button>`;
      }
      if (p.estado === 'preparacion') {
        html += ` <button class="btn btn-sm btn-success" onclick="OrdersPage.updateStatus(${p.id},'entregado')">✅ Entregar</button>`;
      }
      if (p.estado === 'entregado') {
        html += ` <button class="btn btn-sm btn-warning" onclick="OrdersPage.bill(${p.id})">💰 Facturar</button>`;
      }
    }
    return html;
  },

  filter(estado) {
    const rows = document.querySelectorAll('#orders-body tr');
    rows.forEach(r => {
      if (estado === 'all') { r.style.display = ''; return; }
      r.style.display = r.dataset.estado === estado ? '' : 'none';
    });
    document.querySelectorAll('#orders-body').parentElement.parentElement.querySelectorAll('.btn[data-filter]').forEach(b => {
      b.className = `btn btn-sm ${b.dataset.filter === estado ? 'btn-primary' : 'btn-outline'}`;
    });
  },

  updateStatus(id, nuevoEstado) {
    const pedidos = DB.get('pedidos');
    const idx = pedidos.findIndex(p => p.id === id);
    if (idx === -1) return;
    pedidos[idx].estado = nuevoEstado;
    DB.set('pedidos', pedidos);
    App.showToast(`Pedido #${id} actualizado a "${nuevoEstado}"`);
    App.renderPage('orders');
  },

  create() {
    const productos = (DB.get('productos') || []).filter(p => p.disponible);
    const mesas = (DB.get('mesas') || []).filter(m => m.estado === 'libre');
    const categorias = DB.get('categorias') || [];
    const user = Auth.getUser();

    let productHtml = '';
    if (productos.length === 0) {
      productHtml = '<div class="empty-state"><div class="icon">🍽️</div><h3>No hay productos disponibles</h3></div>';
    } else {
      categorias.forEach(cat => {
        const prods = productos.filter(p => p.categoriaId === cat.id);
        if (!prods.length) return;
        productHtml += `<div style="font-weight:600;padding:10px 14px;background:#f8f9fa;border-bottom:1px solid var(--border);">${cat.nombre}</div>`;
        prods.forEach(p => {
          productHtml += `<div class="product-select-item" onclick="OrdersPage.addItem(${p.id},'${p.nombre.replace(/'/g,"\\'")}',${p.precio})">
            <span><strong>${p.nombre}</strong> <span class="text-muted">— $${p.precio.toLocaleString()}</span></span>
            <span class="add-btn">+</span>
          </div>`;
        });
      });
    }

    Modal.show({
      title: 'Nuevo Pedido',
      body: `
        <div class="form-row">
          <div class="form-group">
            <label>Mesa</label>
            <select id="order-mesa">
              ${mesas.length ? mesas.map(m => `<option value="${m.id}">Mesa ${m.numero} (${m.capacidad} pers)</option>`).join('') : '<option value="">No hay mesas libres</option>'}
            </select>
          </div>
          <div class="form-group">
            <label>Cliente</label>
            <input id="order-cliente" placeholder="Nombre del cliente" value="${user.rol === 'cliente' ? user.nombre : ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Productos</label>
          <div class="product-select-list">${productHtml}</div>
        </div>
        <div class="form-group">
          <label>Items seleccionados:</label>
          <div id="order-items-list" style="font-size:13px;color:var(--text-light);">Ninguno</div>
        </div>
        <div class="form-group" style="text-align:right;">
          <strong>Total: $<span id="order-total">0</span></strong>
        </div>
      `,
      onConfirm: () => OrdersPage.save(),
    });
    OrdersPage.resetCart();
  },

  resetCart() {
    window._cart = { items: [], total: 0 };
  },

  addItem(prodId, name, price) {
    if (!window._cart) OrdersPage.resetCart();
    const existing = window._cart.items.find(i => i.productoId === prodId);
    if (existing) {
      existing.cantidad++;
    } else {
      window._cart.items.push({ productoId: prodId, nombre: name, cantidad: 1, precio: price });
    }
    window._cart.total = window._cart.items.reduce((s, i) => s + i.cantidad * i.precio, 0);
    OrdersPage.updateCartUI();
  },

  updateCartUI() {
    const list = document.getElementById('order-items-list');
    const total = document.getElementById('order-total');
    if (!list || !total) return;
    if (!window._cart.items.length) {
      list.innerHTML = 'Ninguno';
      total.textContent = '0';
      return;
    }
    list.innerHTML = window._cart.items.map(i =>
      `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed var(--border);">
        <span>${i.nombre} x${i.cantidad}</span>
        <span>$${(i.cantidad * i.precio).toLocaleString()}</span>
      </div>`
    ).join('');
    total.textContent = window._cart.total.toLocaleString();
  },

  save() {
    const mesaId = parseInt(document.getElementById('order-mesa').value);
    const clienteNombre = document.getElementById('order-cliente').value.trim();
    if (!window._cart || !window._cart.items.length) {
      App.showToast('Agrega al menos un producto', 'error'); return;
    }
    const user = Auth.getUser();
    const pedidos = DB.get('pedidos');
    const mesas = DB.get('mesas');

    const pedido = {
      id: DB.nextId('pedidos'),
      mesaId,
      usuarioId: user.id,
      clienteNombre: clienteNombre || 'Cliente',
      clienteId: user.rol === 'cliente' ? user.id : null,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      items: [...window._cart.items],
      total: window._cart.total,
    };
    pedidos.push(pedido);
    DB.set('pedidos', pedidos);

    const mesa = mesas.find(m => m.id === mesaId);
    if (mesa) { mesa.estado = 'ocupada'; DB.set('mesas', mesas); }

    App.showToast(`Pedido #${pedido.id} creado exitosamente`);
    Modal.close();
    App.renderPage('orders');
  },

  view(id) {
    const pedidos = DB.get('pedidos');
    const p = pedidos.find(pd => pd.id === id);
    if (!p) return;
    const mesas = DB.get('mesas') || [];
    const mesa = mesas.find(m => m.id === p.mesaId);
    const badgeClass = { pendiente: 'warning', preparacion: 'info', entregado: 'success' }[p.estado] || 'secondary';

    Modal.show({
      title: `Pedido #${p.id}`,
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div><strong>Mesa:</strong> ${mesa ? `Mesa ${mesa.numero}` : '—'}</div>
          <div><strong>Cliente:</strong> ${p.clienteNombre || '—'}</div>
          <div><strong>Estado:</strong> <span class="badge badge-${badgeClass}">${p.estado}</span></div>
          <div><strong>Fecha:</strong> ${new Date(p.fecha).toLocaleString('es-CO')}</div>
        </div>
        <table class="data-table">
          <thead><tr><th>Producto</th><th>Cant</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${(p.items || []).map(i => `<tr><td>${i.nombre}</td><td>${i.cantidad}</td><td>$${i.precio.toLocaleString()}</td><td>$${(i.cantidad * i.precio).toLocaleString()}</td></tr>`).join('')}
          </tbody>
          <tfoot><tr><td colspan="3" style="text-align:right;font-weight:700;">Total</td><td style="font-weight:700;">$${(p.total || 0).toLocaleString()}</td></tr></tfoot>
        </table>
      `,
      footer: '<button class="btn btn-primary" onclick="Modal.close()">Cerrar</button>',
    });
  },

  bill(id) {
    const pedidos = DB.get('pedidos');
    const p = pedidos.find(pd => pd.id === id);
    if (!p) return;

    Modal.show({
      title: `Facturar Pedido #${id}`,
      body: `
        <div class="form-group">
          <label>Método de pago</label>
          <select id="payment-method">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div style="background:#f8f9fa;padding:16px;border-radius:var(--radius-sm);">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>Subtotal:</span><span>$${(p.total || 0).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>IVA (19%):</span><span>$${Math.round((p.total || 0) * 0.19).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;border-top:2px solid var(--border);padding-top:8px;">
            <span>Total:</span><span>$${Math.round((p.total || 0) * 1.19).toLocaleString()}</span>
          </div>
        </div>
      `,
      onConfirm: () => OrdersPage.confirmBill(id),
    });
  },

  confirmBill(id) {
    const metodoPago = document.getElementById('payment-method').value;
    const pedidos = DB.get('pedidos');
    const p = pedidos.find(pd => pd.id === id);
    if (!p) return;

    const facturas = DB.get('facturas') || [];
    const factura = {
      id: DB.nextId('facturas'),
      pedidoId: id,
      fecha: new Date().toISOString(),
      subtotal: p.total,
      impuesto: Math.round(p.total * 0.19),
      total: Math.round(p.total * 1.19),
      metodoPago,
      estado: 'pagada',
      clienteNombre: p.clienteNombre || 'Cliente',
    };
    facturas.push(factura);
    DB.set('facturas', facturas);
    App.showToast(`Factura #${factura.id} generada - Total: $${factura.total.toLocaleString()}`);
    Modal.close();
    App.renderPage('orders');
  },
};

window.OrdersPage = App.pages.orders;
