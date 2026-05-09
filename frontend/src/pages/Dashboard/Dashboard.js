App.registerPage('dashboard', {
  title: 'Dashboard',
  allowedRoles: ['admin'],

  render(container) {
    const pedidos = DB.get('pedidos') || [];
    const facturas = DB.get('facturas') || [];
    const productos = DB.get('productos') || [];
    const hoy = new Date().toDateString();

    const pedidosHoy = pedidos.filter(p => new Date(p.fecha).toDateString() === hoy);
    const ventasHoy = facturas.filter(f => new Date(f.fecha).toDateString() === hoy && f.estado === 'pagada');
    const totalHoy = ventasHoy.reduce((s, f) => s + f.total, 0);
    const pendientes = pedidos.filter(p => p.estado === 'pendiente').length;

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">📋</div>
          <div class="stat-info">
            <h3>${pedidosHoy.length}</h3>
            <p>Pedidos Hoy</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">💰</div>
          <div class="stat-info">
            <h3>$${totalHoy.toLocaleString()}</h3>
            <p>Ventas Hoy</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">⏳</div>
          <div class="stat-info">
            <h3>${pendientes}</h3>
            <p>Pendientes</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">🍽️</div>
          <div class="stat-info">
            <h3>${productos.filter(p => p.disponible).length}</h3>
            <p>Productos Activos</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h2>📋 Pedidos Recientes</h2>
          <button class="btn btn-primary btn-sm" onclick="App.navigate('orders')">Ver Todos</button>
        </div>
        <div class="card-body card-body-inner">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mesa</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${pedidos.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No hay pedidos registrados</td></tr>' :
                  pedidos.slice(-5).reverse().map(p => `
                    <tr>
                      <td><strong>#${p.id}</strong></td>
                      <td>Mesa ${p.mesaId}</td>
                      <td>${p.clienteNombre || '—'}</td>
                      <td>$${(p.total || 0).toLocaleString()}</td>
                      <td><span class="badge badge-${p.estado === 'pendiente' ? 'warning' : p.estado === 'preparacion' ? 'info' : 'success'}">${p.estado}</span></td>
                      <td>${new Date(p.fecha).toLocaleString('es-CO')}</td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="stats-grid" style="margin-top:20px;">
        <div class="stat-card" onclick="App.navigate('menu')" style="cursor:pointer;">
          <div class="stat-icon orange">🍽️</div>
          <div class="stat-info">
            <h3>Gestionar Menú</h3>
            <p>Administrar productos y categorías</p>
          </div>
        </div>
        <div class="stat-card" onclick="App.navigate('reports')" style="cursor:pointer;">
          <div class="stat-icon red">📈</div>
          <div class="stat-info">
            <h3>Ver Reportes</h3>
            <p>Análisis de ventas y rendimiento</p>
          </div>
        </div>
        <div class="stat-card" onclick="App.navigate('users')" style="cursor:pointer;">
          <div class="stat-icon blue">👥</div>
          <div class="stat-info">
            <h3>Usuarios</h3>
            <p>Gestión de usuarios del sistema</p>
          </div>
        </div>
      </div>
    `;
  },
});
