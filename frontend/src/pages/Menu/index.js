App.registerPage('menu', {
  title: 'Menú',
  allowedRoles: ['admin', 'mesero', 'cliente'],

  render(container) {
    const user = Auth.getUser();
    const esAdmin = user.rol === 'admin';
    const productos = DB.get('productos') || [];
    const categorias = DB.get('categorias') || [];

    container.innerHTML = `
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <h2>🍽️ Todos los Productos</h2>
          ${esAdmin ? '<button class="btn btn-primary btn-sm" onclick="MenuPage.showForm()">+ Nuevo Producto</button>' : ''}
        </div>
        <div class="card-body card-body-inner">
          <div style="display:flex;gap:8px;padding:16px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap;" id="category-filters">
            <button class="btn btn-sm btn-primary" data-cat="all" onclick="MenuPage.filter('all')">Todos</button>
            ${categorias.map(c => `<button class="btn btn-sm btn-outline" data-cat="${c.id}" onclick="MenuPage.filter(${c.id})">${c.nombre}</button>`).join('')}
          </div>
          <div class="table-container">
            <table class="data-table" id="menu-table">
              <thead><tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Disponible</th>
                ${esAdmin ? '<th>Acciones</th>' : ''}
              </tr></thead>
              <tbody id="menu-body">
                ${MenuPage.renderRows(productos, categorias, esAdmin)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderRows(productos, categorias, esAdmin) {
    if (!productos.length) return `<tr><td colspan="${esAdmin ? 5 : 4}" class="text-center text-muted">No hay productos registrados</td></tr>`;
    return productos.map(p => {
      const cat = categorias.find(c => c.id === p.categoriaId);
      return `<tr data-cat="${p.categoriaId}">
        <td><strong>${p.nombre}</strong><br><small class="text-muted">${p.descripcion || ''}</small></td>
        <td><span class="badge badge-info">${cat ? cat.nombre : '—'}</span></td>
        <td><strong>$${(p.precio || 0).toLocaleString()}</strong></td>
        <td>${p.disponible ? '<span class="badge badge-success">Disponible</span>' : '<span class="badge badge-danger">Agotado</span>'}</td>
        ${esAdmin ? `<td>
          <button class="btn btn-sm btn-outline" onclick="MenuPage.edit(${p.id})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="MenuPage.remove(${p.id})">🗑️</button>
        </td>` : ''}
      </tr>`;
    }).join('');
  },

  filter(catId) {
    const rows = document.querySelectorAll('#menu-body tr');
    rows.forEach(r => {
      if (catId === 'all') { r.style.display = ''; return; }
      r.style.display = r.dataset.cat == catId ? '' : 'none';
    });
    document.querySelectorAll('#category-filters .btn').forEach(b => {
      b.className = `btn btn-sm ${b.dataset.cat == catId ? 'btn-primary' : 'btn-outline'}`;
    });
  },

  showForm(product) {
    const categorias = DB.get('categorias') || [];
    const isEdit = !!product;
    Modal.show({
      title: isEdit ? 'Editar Producto' : 'Nuevo Producto',
      body: `
        <div class="form-group">
          <label>Nombre del producto</label>
          <input id="prod-nombre" value="${isEdit ? product.nombre : ''}" placeholder="Ej: Ceviche Clásico">
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea id="prod-descripcion" placeholder="Descripción del plato">${isEdit ? (product.descripcion || '') : ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Categoría</label>
            <select id="prod-categoria">
              ${categorias.map(c => `<option value="${c.id}" ${isEdit && product.categoriaId === c.id ? 'selected' : ''}>${c.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Precio ($)</label>
            <input id="prod-precio" type="number" value="${isEdit ? product.precio : ''}" placeholder="0">
          </div>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="prod-disponible" ${isEdit ? (product.disponible ? 'checked' : '') : 'checked'} style="width:auto;">
            Producto disponible
          </label>
        </div>
      `,
      onConfirm: () => MenuPage.save(product?.id),
    });
  },

  edit(id) {
    id = Number(id);
    const productos = DB.get('productos') || [];
    const product = productos.find(p => p.id === id);
    if (product) this.showForm(product);
  },

  save(id) {
    try {
      const productos = DB.get('productos') || [];
      const data = {
        nombre: document.getElementById('prod-nombre').value.trim(),
        descripcion: document.getElementById('prod-descripcion').value.trim(),
        precio: parseInt(document.getElementById('prod-precio').value) || 0,
        categoriaId: parseInt(document.getElementById('prod-categoria').value),
        disponible: document.getElementById('prod-disponible').checked,
      };
      if (!data.nombre) { App.showToast('El nombre es obligatorio', 'error'); return; }
      if (data.precio <= 0) { App.showToast('El precio debe ser mayor a 0', 'error'); return; }

      if (id) {
        id = Number(id);
        const idx = productos.findIndex(p => p.id === id);
        if (idx !== -1) { productos[idx] = { ...productos[idx], ...data }; }
      } else {
        data.id = DB.nextId('productos');
        productos.push(data);
      }
      DB.set('productos', productos);
      Modal.close();
      App.renderPage('menu');
      App.showToast(id ? 'Producto actualizado' : 'Producto creado');
    } catch (e) {
      console.error('Error saving product:', e);
      App.showToast('Error al guardar: ' + e.message, 'error');
    }
  },

  remove(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    const productos = DB.get('productos') || [];
    DB.set('productos', productos.filter(p => p.id !== Number(id)));
    App.renderPage('menu');
    App.showToast('Producto eliminado');
  },
});

window.MenuPage = App.pages.menu;
