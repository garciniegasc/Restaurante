App.registerPage('login', {
  title: 'Iniciar Sesión',

  render(container) {
    container.innerHTML = `
      <div class="login-card">
        <div class="login-header">
          <h1>SIGR</h1>
          <p>Sistema Integral de Gestión de Restaurante</p>
        </div>
        <div class="login-body">
          <div class="role-selector" id="role-selector">
            <div class="role-option selected" data-role="admin">
              <span class="icon">👑</span> Administrador
            </div>
            <div class="role-option" data-role="mesero">
              <span class="icon">👨‍🍳</span> Mesero
            </div>
            <div class="role-option" data-role="cliente">
              <span class="icon">👤</span> Cliente
            </div>
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" id="login-email" placeholder="correo@restaurant.com" value="admin@restaurant.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" id="login-password" placeholder="••••••••" value="admin123">
          </div>
          <button class="btn btn-primary btn-lg w-full" id="login-btn" onclick="handleLogin()">Iniciar Sesión</button>
          <p style="margin-top:12px;font-size:12px;color:var(--text-light);text-align:center;" id="login-hint">
            Admin: admin@restaurant.com / admin123
          </p>
        </div>
        <div class="login-footer">
          &copy; 2026 SIGR - Todos los derechos reservados
        </div>
      </div>
    `;

    document.querySelectorAll('.role-option').forEach(el => {
      el.onclick = () => {
        document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
        el.classList.add('selected');
        const role = el.dataset.role;
        const creds = {
          admin: { email: 'admin@restaurant.com', password: 'admin123', hint: 'Admin: admin@restaurant.com / admin123' },
          mesero: { email: 'mesero@restaurant.com', password: 'mesero123', hint: 'Mesero: mesero@restaurant.com / mesero123' },
          cliente: { email: 'cliente@restaurant.com', password: 'cliente123', hint: 'Cliente: cliente@restaurant.com / cliente123' },
        };
        document.getElementById('login-email').value = creds[role].email;
        document.getElementById('login-password').value = creds[role].password;
        document.getElementById('login-hint').textContent = creds[role].hint;
      };
    });

    document.getElementById('login-password').onkeydown = (e) => {
      if (e.key === 'Enter') handleLogin();
    };
  },
});

window.handleLogin = function() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const result = Auth.login(email, password);
  if (result.success) {
    App.navigate(Auth.getRedirect());
  } else {
    App.showToast(result.error, 'error');
  }
};
