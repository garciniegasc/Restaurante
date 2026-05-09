App.registerPage('reservations', {
  title: 'Reservas',
  allowedRoles: ['admin', 'mesero', 'cliente'],

  render(container) {
    const user = Auth.getUser();
    const reservas = DB.get('reservas') || [];
    const hoy = new Date();

    const misReservas = user.rol === 'cliente'
      ? reservas.filter(r => r.usuarioId === user.id)
      : reservas;

    const activas = misReservas.filter(r => new Date(r.fecha) >= hoy || r.estado === 'pendiente');
    const pasadas = misReservas.filter(r => new Date(r.fecha) < hoy && r.estado !== 'pendiente');

    container.innerHTML = `
      <div style="margin-bottom:20px;">
        <button class="btn btn-primary" onclick="ReservationsPage.create()">+ Nueva Reserva</button>
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><h2>📅 Reservas Activas</h2></div>
        <div class="card-body card-body-inner">
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr></thead>
              <tbody>
                ${ReservationsPage.renderRows(activas)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ${pasadas.length ? `
        <div class="card">
          <div class="card-header"><h2>📋 Historial</h2></div>
          <div class="card-body card-body-inner">
            <div class="table-container">
              <table class="data-table">
                <thead><tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Personas</th>
                  <th>Estado</th>
                </tr></thead>
                <tbody>${ReservationsPage.renderRows(pasadas)}</tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  },

  renderRows(reservas) {
    if (!reservas.length) return '<tr><td colspan="7" class="text-center text-muted">No hay reservas</td></tr>';
    return reservas.slice().reverse().map(r => {
      const badgeClass = { pendiente: 'warning', confirmada: 'success', cancelada: 'danger', completada: 'info' }[r.estado] || 'secondary';
      return `<tr>
        <td><strong>#${r.id}</strong></td>
        <td>${r.clienteNombre || '—'}</td>
        <td>${new Date(r.fecha).toLocaleDateString('es-CO')}</td>
        <td>${r.hora}</td>
        <td>${r.personas}</td>
        <td><span class="badge badge-${badgeClass}">${r.estado}</span></td>
        <td class="actions">
          ${r.estado === 'pendiente' ? `<button class="btn btn-sm btn-danger" onclick="ReservationsPage.cancel(${r.id})">Cancelar</button>` : ''}
        </td>
      </tr>`;
    }).join('');
  },

  create() {
    const user = Auth.getUser();
    const hoy = new Date().toISOString().split('T')[0];

    Modal.show({
      title: 'Nueva Reserva',
      body: `
        <div class="form-group">
          <label>Nombre del cliente</label>
          <input id="res-cliente" value="${user.rol === 'cliente' ? user.nombre : ''}" placeholder="Nombre completo">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Fecha</label>
            <input id="res-fecha" type="date" value="${hoy}" min="${hoy}">
          </div>
          <div class="form-group">
            <label>Hora</label>
            <input id="res-hora" type="time" value="20:00">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Número de personas</label>
            <input id="res-personas" type="number" value="2" min="1" max="20">
          </div>
          <div class="form-group">
            <label>Email de contacto</label>
            <input id="res-email" type="email" value="${user.email || ''}" placeholder="correo@ejemplo.com">
          </div>
        </div>
        <div class="form-group">
          <label>Notas</label>
          <textarea id="res-notas" placeholder="Alergias, ocasión especial, preferencias..."></textarea>
        </div>
      `,
      onConfirm: () => ReservationsPage.save(),
    });
  },

  save() {
    const user = Auth.getUser();
    const reservas = DB.get('reservas') || [];
    const data = {
      clienteNombre: document.getElementById('res-cliente').value.trim(),
      fecha: document.getElementById('res-fecha').value,
      hora: document.getElementById('res-hora').value,
      personas: parseInt(document.getElementById('res-personas').value) || 1,
      email: document.getElementById('res-email').value.trim(),
      notas: document.getElementById('res-notas').value.trim(),
    };
    if (!data.clienteNombre) { App.showToast('El nombre es obligatorio', 'error'); return; }
    if (!data.fecha || !data.hora) { App.showToast('Fecha y hora son obligatorias', 'error'); return; }

    const reserva = {
      id: DB.nextId('reservas'),
      ...data,
      usuarioId: user.id,
      estado: 'pendiente',
      creada: new Date().toISOString(),
    };
    reservas.push(reserva);
    DB.set('reservas', reservas);
    App.showToast('Reserva creada exitosamente');
    Modal.close();
    App.renderPage('reservations');
  },

  cancel(id) {
    if (!confirm('¿Cancelar esta reserva?')) return;
    const reservas = DB.get('reservas');
    const r = reservas.find(res => res.id === id);
    if (r) { r.estado = 'cancelada'; DB.set('reservas', reservas); }
    App.showToast('Reserva cancelada');
    App.renderPage('reservations');
  },
});

window.ReservationsPage = App.pages.reservations;
