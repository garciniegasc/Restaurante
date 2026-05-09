App.registerPage('reports', {
  title: 'Reportes',
  allowedRoles: ['admin'],

  render(container) {
    const pedidos = DB.get('pedidos') || [];
    const facturas = DB.get('facturas') || [];
    const productos = DB.get('productos') || [];

    const facturasPagadas = facturas.filter(f => f.estado === 'pagada');
    const totalIngresos = facturasPagadas.reduce((s, f) => s + f.total, 0);
    const totalIVA = facturasPagadas.reduce((s, f) => s + (f.impuesto || 0), 0);

    const ventasPorProducto = {};
    pedidos.forEach(p => {
      (p.items || []).forEach(i => {
        ventasPorProducto[i.nombre] = (ventasPorProducto[i.nombre] || 0) + i.cantidad;
      });
    });
    const topProductos = Object.entries(ventasPorProducto)
      .sort((a, b) => b[1] - a[1]).slice(0, 10);

    const ventasPorDia = {};
    facturasPagadas.forEach(f => {
      const dia = new Date(f.fecha).toLocaleDateString('es-CO');
      ventasPorDia[dia] = (ventasPorDia[dia] || 0) + f.total;
    });
    const dias = Object.keys(ventasPorDia).slice(-7);
    const valores = dias.map(d => ventasPorDia[d]);

    const maxValor = Math.max(...valores, 1);

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon green">💰</div>
          <div class="stat-info"><h3>$${totalIngresos.toLocaleString()}</h3><p>Ingresos Totales</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">🧾</div>
          <div class="stat-info"><h3>$${totalIVA.toLocaleString()}</h3><p>IVA Total</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">📋</div>
          <div class="stat-info"><h3>${facturasPagadas.length}</h3><p>Facturas Emitidas</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">🍽️</div>
          <div class="stat-info"><h3>${pedidos.length}</h3><p>Pedidos Totales</p></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><h2>📊 Ventas por Día (últimos 7 días)</h2></div>
        <div class="card-body">
          ${dias.length === 0 ? '<p class="text-muted">No hay datos de ventas</p>' : `
            <div style="display:flex;align-items:flex-end;gap:8px;height:200px;padding-top:20px;">
              ${dias.map((d, i) => `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
                  <div style="font-size:11px;font-weight:600;margin-bottom:4px;">
                    $${(valores[i] || 0).toLocaleString()}
                  </div>
                  <div style="width:100%;background:var(--accent);border-radius:4px 4px 0 0;transition:var(--transition);"
                       onmouseover="this.style.opacity='0.8'"
                       onmouseout="this.style.opacity='1'"
                       style="width:100%;height:${((valores[i] || 0) / maxValor * 100)}%;background:var(--accent);border-radius:4px 4px 0 0;min-height:4px;">
                  </div>
                  <div style="font-size:10px;color:var(--text-light);margin-top:8px;text-align:center;writing-mode:vertical-lr;transform:rotate(0);">
                    ${d}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="card">
          <div class="card-header"><h2>🏆 Productos Más Vendidos</h2></div>
          <div class="card-body card-body-inner">
            ${topProductos.length === 0 ? '<div class="empty-state"><h3>Sin datos</h3></div>' : `
              <table class="data-table">
                <thead><tr><th>#</th><th>Producto</th><th>Cantidad</th></tr></thead>
                <tbody>
                  ${topProductos.map(([nombre, cant], i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${nombre}</td>
                      <td><strong>${cant}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>📈 Resumen de Caja</h2></div>
          <div class="card-body">
            <div style="display:grid;gap:12px;">
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>Total facturado</span>
                <strong>$${totalIngresos.toLocaleString()}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>IVA total</span>
                <strong>$${totalIVA.toLocaleString()}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>Pedidos procesados</span>
                <strong>${pedidos.length}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>Facturas emitidas</span>
                <strong>${facturasPagadas.length}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
                <span>Promedio por factura</span>
                <strong>$${facturasPagadas.length ? Math.round(totalIngresos / facturasPagadas.length).toLocaleString() : '0'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
});
