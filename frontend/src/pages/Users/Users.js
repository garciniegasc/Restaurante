App.registerPage('users', {
  title: 'Usuarios',
  allowedRoles: ['admin'],

  render(container) {
    const usuarios = DB.get('usuarios') || [];
    const roleMap = { admin: 'Administrador', mesero: 'Mesero', cliente: 'Cliente' };

    container.innerHTML = `
      <div style="margin-bottom:20px;">
        <button class="btn btn-primary" onclick="UsersPage.create()">+ Nuevo Usuario</button>
      </div>
      <div class="card">
        <div class="card-header"><h2>👥 Usuarios del Sistema</h2></div>
        <div class="card-body card-body-inner">
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr></thead>
              <tbody>
                ${usuarios.map(u => `
                  <tr>
                    <td>#${u.id}</td>
                    <td><strong>${u.nombre}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="badge badge-${u.rol === 'admin' ? 'danger' : u.rol === 'mesero' ? 'info' : 'secondary'}">${roleMap[u.rol] || u.rol}</span></td>
                    <td class="actions">
                      <button class="btn btn-sm btn-outline" onclick="UsersPage.edit(${u.id})">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="UsersPage.remove(${u.id})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  create() {
    this.showForm(null);
  },

  edit(id) {
    id = Number(id);
    const usuarios = DB.get('usuarios') || [];
    const user = usuarios.find(u => u.id === id);
    if (user) this.showForm(user);
  },

  showForm(user) {
    const isEdit = !!user;
    Modal.show({
      title: isEdit ? 'Editar Usuario' : 'Nuevo Usuario',
      body: `
        <div class="form-group">
          <label>Nombre completo</label>
          <input id="user-nombre" value="${isEdit ? user.nombre : ''}" placeholder="Nombre del usuario">
        </div>
        <div class="form-group">
          <label>Correo electrónico</label>
          <input id="user-email" type="email" value="${isEdit ? user.email : ''}" placeholder="correo@restaurant.com">
        </div>
        <div class="form-group">
          <label>Contraseña ${isEdit ? '(dejar vacío para no cambiar)' : ''}</label>
          <input id="user-password" type="password" placeholder="${isEdit ? '••••••••' : 'Contraseña'}">
        </div>
        <div class="form-group">
          <label>Rol</label>
          <select id="user-rol">
            <option value="admin" ${isEdit && user.rol === 'admin' ? 'selected' : ''}>Administrador</option>
            <option value="mesero" ${isEdit && user.rol === 'mesero' ? 'selected' : ''}>Mesero</option>
            <option value="cliente" ${isEdit && user.rol === 'cliente' ? 'selected' : ''}>Cliente</option>
          </select>
        </div>
      `,
      onConfirm: () => UsersPage.save(isEdit ? user.id : null),
    });
  },

  save(id) {
    try {
      const usuarios = DB.get('usuarios') || [];
      const data = {
        nombre: document.getElementById('user-nombre').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        rol: document.getElementById('user-rol').value,
        password: document.getElementById('user-password').value,
      };
      if (!data.nombre || !data.email) { App.showToast('Nombre y email son obligatorios', 'error'); return; }
      if (!id && !data.password) { App.showToast('La contraseña es obligatoria', 'error'); return; }

      if (id) {
        id = Number(id);
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx !== -1) {
          usuarios[idx].nombre = data.nombre;
          usuarios[idx].email = data.email;
          usuarios[idx].rol = data.rol;
          if (data.password) usuarios[idx].password = data.password;
        }
      } else {
        data.id = DB.nextId('usuarios');
        usuarios.push(data);
      }
      DB.set('usuarios', usuarios);
      Modal.close();
      App.renderPage('users');
      App.showToast(id ? 'Usuario actualizado' : 'Usuario creado');
    } catch (e) {
      console.error('Error saving user:', e);
      App.showToast('Error al guardar: ' + e.message, 'error');
    }
  },

  remove(id) {
    id = Number(id);
    const user = Auth.getUser();
    if (Number(user.id) === id) { App.showToast('No puedes eliminarte a ti mismo', 'error'); return; }
    if (!confirm('¿Eliminar este usuario?')) return;
    const usuarios = DB.get('usuarios') || [];
    DB.set('usuarios', usuarios.filter(u => Number(u.id) !== id));
    App.renderPage('users');
    App.showToast('Usuario eliminado');
  },
});

window.UsersPage = App.pages.users;
