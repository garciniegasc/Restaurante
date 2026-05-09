App.registerPage('billing', {
  title: 'Facturación',
  allowedRoles: ['admin', 'mesero', 'cliente'],

  render(container) {
    const user = Auth.getUser();
    const facturas = DB.get('facturas') || [];

    const misFacturas = user.rol === 'cliente'
      ? facturas.filter(f => f.clienteNombre === user.nombre)
      : facturas;

    container.innerHTML = `
      <div style="margin-bottom:20px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-primary" onclick="BillingPage.filter('all')" data-bf="all">Todas</button>
        <button class="btn btn-sm btn-outline" onclick="BillingPage.filter('efectivo')" data-bf="efectivo">Efectivo</button>
        <button class="btn btn-sm btn-outline" onclick="BillingPage.filter('tarjeta')" data-bf="tarjeta">Tarjeta</button>
        <button class="btn btn-sm btn-outline" onclick="BillingPage.filter('transferencia')" data-bf="transferencia">Transferencia</button>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>💰 Facturas</h2>
          <span style="font-size:13px;color:var(--text-light);">Total: $${misFacturas.reduce((s, f) => s + f.total, 0).toLocaleString()}</span>
        </div>
        <div class="card-body card-body-inner">
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th># Factura</th>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr></thead>
              <tbody id="billing-body">
                ${BillingPage.renderRows(misFacturas)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderRows(facturas) {
    if (!facturas.length) return '<tr><td colspan="9" class="text-center text-muted">No hay facturas</td></tr>';
    return facturas.slice().reverse().map(f => `
      <tr data-metodo="${f.metodoPago}">
        <td><strong>#${f.id}</strong></td>
        <td>#${f.pedidoId}</td>
        <td>${f.clienteNombre || '—'}</td>
        <td>$${(f.subtotal || 0).toLocaleString()}</td>
        <td>$${(f.impuesto || 0).toLocaleString()}</td>
        <td><strong>$${(f.total || 0).toLocaleString()}</strong></td>
        <td><span class="badge badge-info">${f.metodoPago}</span></td>
        <td>${new Date(f.fecha).toLocaleString('es-CO')}</td>
        <td><button class="btn btn-sm btn-outline" onclick="BillingPage.view(${f.id})">👁️ Ver</button></td>
      </tr>
    `).join('');
  },

  filter(metodo) {
    const rows = document.querySelectorAll('#billing-body tr');
    rows.forEach(r => {
      if (metodo === 'all') { r.style.display = ''; return; }
      r.style.display = r.dataset.metodo === metodo ? '' : 'none';
    });
    document.querySelectorAll('[data-bf]').forEach(b => {
      b.className = `btn btn-sm ${b.dataset.bf === metodo ? 'btn-primary' : 'btn-outline'}`;
    });
  },

  view(id) {
    const facturas = DB.get('facturas') || [];
    const f = facturas.find(fa => fa.id === id);
    if (!f) return;

    Modal.show({
      title: `Factura #${f.id}`,
      body: `
        <div style="text-align:center;margin-bottom:20px;">
          <h2 style="color:var(--accent);font-size:22px;">SIGR</h2>
          <p style="font-size:13px;color:var(--text-light);">Sistema Integral de Gestión de Restaurante</p>
          <p style="font-size:12px;color:var(--text-light);">NIT: 901.123.456-7</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:13px;">
          <div><strong>Factura #:</strong> ${f.id}</div>
          <div><strong>Pedido #:</strong> ${f.pedidoId}</div>
          <div><strong>Cliente:</strong> ${f.clienteNombre || '—'}</div>
          <div><strong>Fecha:</strong> ${new Date(f.fecha).toLocaleString('es-CO')}</div>
        </div>
        <div style="border-top:2px dashed var(--border);border-bottom:2px dashed var(--border);padding:16px 0;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>Subtotal:</span><span>$${(f.subtotal || 0).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span>IVA (19%):</span><span>$${(f.impuesto || 0).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:700;padding-top:8px;border-top:1px solid var(--border);">
            <span>TOTAL:</span><span>$${(f.total || 0).toLocaleString()}</span>
          </div>
        </div>
        <div style="text-align:center;font-size:13px;">
          <strong>Método de pago:</strong> ${f.metodoPago}
          <br><span class="badge badge-success">${f.estado}</span>
        </div>
      `,
      footer: '<button class="btn btn-primary" onclick="Modal.close()">Cerrar</button>',
    });
  },
});

window.BillingPage = App.pages.billing;
