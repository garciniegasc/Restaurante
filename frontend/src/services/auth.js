const Auth = {
  currentUser: null,

  init() {
    const saved = sessionStorage.getItem('sigr_user');
    if (saved) {
      this.currentUser = JSON.parse(saved);
    }
  },

  login(email, password) {
    const usuarios = DB.get('usuarios') || [];
    const user = usuarios.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Credenciales inválidas' };
    this.currentUser = user;
    sessionStorage.setItem('sigr_user', JSON.stringify(user));
    return { success: true, user };
  },

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('sigr_user');
    App.navigate('login');
  },

  isAuthenticated() {
    return this.currentUser !== null;
  },

  hasRole(...roles) {
    return this.isAuthenticated() && roles.includes(this.currentUser.rol);
  },

  getRole() {
    return this.currentUser?.rol || null;
  },

  getUser() {
    return this.currentUser;
  },

  getRedirect() {
    if (!this.currentUser) return 'login';
    switch (this.currentUser.rol) {
      case 'admin': return 'dashboard';
      case 'mesero': return 'orders';
      case 'cliente': return 'menu';
      default: return 'login';
    }
  },
};
