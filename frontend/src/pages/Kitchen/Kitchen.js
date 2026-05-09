App.registerPage('kitchen', {
  title: 'Cocina',
  allowedRoles: ['admin', 'mesero'],

  render(container) {
    const pedidos = (DB.get('pedidos') || [])
      .filter(p => p.estado === 'pendiente' || p.estado === 'preparacion')
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    container.innerHTML = `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <h2>👨‍🍳 Órdenes de Cocina</h2>
          <span style="font-size:13px;color:var(--text-light);">${pedidos.length} orden(es) activa(s)</span>
        </div>
      </div>
      ${pedidos.length === 0 ? `
        <div class="empty-state">
          <div class="icon">✅</div>
          <h3>No hay órdenes pendientes</h3>
          <p>Todas las órdenes han sido atendidas</p>
        </div>
      ` : `
        <div class="kitchen-grid">
          ${pedidos.map(p => `
            <div class="kitchen-card ${p.estado === 'preparacion' ? 'preparing' : ''}">
              <div class="order-meta">
                <span class="order-number">Pedido #${p.id}</span>
                <span class="badge badge-${p.estado === 'pendiente' ? 'warning' : 'info'}">${p.estado}</span>
              </div>
              <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">
                ${p.clienteNombre ? `Cliente: ${p.clienteNombre}` : ''} ${p.mesaId ? `| Mesa ${p.mesaId}` : ''}
              </div>
              <div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">
                ${new Date(p.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <ul class="order-items">
                ${(p.items || []).map(i => `
                  <li>
                    <span>${i.nombre}</span>
                    <span><strong>x${i.cantidad}</strong></span>
                  </li>`).join('')}
              </ul>
              <div style="margin-top:12px;display:flex;gap:8px;">
                ${p.estado === 'pendiente'
                  ? `<button class="btn btn-info btn-sm w-full" onclick="KitchenPage.startPrep(${p.id})">👨‍🍳 Iniciar Preparación</button>`
                  : `<button class="btn btn-success btn-sm w-full" onclick="KitchenPage.finish(${p.id})">✅ Marcar Listo</button>`
                }
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  },

  startPrep(id) {
    OrdersPage.updateStatus(id, 'preparacion');
  },

  finish(id) {
    OrdersPage.updateStatus(id, 'entregado');
  },
});

window.KitchenPage = App.pages.kitchen;
