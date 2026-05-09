const App = {
  pages: {},
  currentPage: null,

  registerPage(name, config) {
    this.pages[name] = config;
  },

  init() {
    Auth.init();
    Store.init();
    this.buildShell();
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  buildShell() {
    const user = Auth.getUser();
    document.body.innerHTML = `
      <div id="login-page" class="login-container"></div>
      <div id="app-shell" class="app-layout" style="display:none">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <h2>SIGR</h2>
            <small>Sistema Integral Gestión Restaurante</small>
          </div>
          <ul class="sidebar-nav" id="sidebar-nav">
            <li><a href="#dashboard" data-page="dashboard"><span class="icon">📊</span> Dashboard</a></li>
            <li><a href="#menu" data-page="menu"><span class="icon">🍽️</span> Menú</a></li>
            <li><a href="#orders" data-page="orders"><span class="icon">📝</span> Pedidos</a></li>
            <li><a href="#kitchen" data-page="kitchen"><span class="icon">👨‍🍳</span> Cocina</a></li>
            <li><a href="#reservations" data-page="reservations"><span class="icon">📅</span> Reservas</a></li>
            <li><a href="#billing" data-page="billing"><span class="icon">💰</span> Facturación</a></li>
            <li><a href="#reports" data-page="reports"><span class="icon">📈</span> Reportes</a></li>
            <li><a href="#users" data-page="users"><span class="icon">👥</span> Usuarios</a></li>
          </ul>
          <div class="sidebar-footer">
            <div class="user-info">
              <div class="avatar" id="sidebar-avatar">A</div>
              <div>
                <div class="user-name" id="sidebar-name">Usuario</div>
                <div class="user-role" id="sidebar-role">Rol</div>
              </div>
            </div>
          </div>
        </aside>
        <main class="main-content">
          <header class="header">
            <div class="header-left">
              <button class="menu-toggle" id="menu-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
              <h1 id="page-title">Dashboard</h1>
            </div>
            <div class="header-right">
              <span class="date-display" id="date-display"></span>
              <button class="btn-logout" onclick="Auth.logout()">🚪 Salir</button>
            </div>
          </header>
          <div id="page-content" class="page-content active"></div>
        </main>
      </div>
      <div id="modal-container"></div>
      <div id="toast-container" class="toast-container"></div>
    `;
    this.updateDate();
    setInterval(() => this.updateDate(), 60000);
  },

  updateDate() {
    const d = document.getElementById('date-display');
    if (d) d.textContent = new Date().toLocaleDateString('es-CO', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  },

  handleRoute(hash) {
    console.log('handleRoute called, hash arg:', hash, 'location.hash:', location.hash);
    if (!hash) hash = location.hash.slice(1) || 'login';
    console.log('handleRoute resolved hash:', hash);
    if (hash !== 'login' && !Auth.isAuthenticated()) {
      this.navigate('login');
      return;
    }
    this.renderPage(hash);
  },

  navigate(page) {
    console.log('App.navigate:', page);
    location.hash = page;
  },

  renderPage(name) {
    const page = this.pages[name];
    if (!page) { this.navigate('dashboard'); return; }

    const user = Auth.getUser();
    if (page.allowedRoles && !page.allowedRoles.includes(user?.rol)) {
      this.navigate(Auth.getRedirect());
      return;
    }

    this.currentPage = name;
    const shell = document.getElementById('app-shell');
    const loginPage = document.getElementById('login-page');

    if (name === 'login') {
      shell.style.display = 'none';
      loginPage.style.display = 'flex';
      page.render(loginPage);
      return;
    }

    shell.style.display = 'flex';
    loginPage.style.display = 'none';
    document.getElementById('page-title').textContent = page.title;
    document.title = `SIGR - ${page.title}`;

    if (page.init) page.init();
    page.render(document.getElementById('page-content'));

    document.querySelectorAll('.sidebar-nav a').forEach(a =>
      a.classList.toggle('active', a.dataset.page === name)
    );

    this.updateSidebarUser(user);
    document.getElementById('sidebar').classList.remove('open');
  },

  showToast(message, type) {
    Toast.show(message, type);
  },

  updateSidebarUser(user) {
    if (!user) return;
    document.getElementById('sidebar-avatar').textContent = user.nombre.charAt(0).toUpperCase();
    document.getElementById('sidebar-name').textContent = user.nombre;
    const roleMap = { admin: 'Administrador', mesero: 'Mesero', cliente: 'Cliente' };
    document.getElementById('sidebar-role').textContent = roleMap[user.rol] || user.rol;
    const allowed = PAGES_BY_ROLE[user.rol] || [];
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
      const a = li.querySelector('a');
      if (a) li.style.display = allowed.includes(a.dataset.page) ? '' : 'none';
    });
  },
};

window.App = App;
