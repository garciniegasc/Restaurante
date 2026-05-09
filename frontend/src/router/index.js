const Router = {
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  resolve() {
    const hash = location.hash.slice(1) || 'login';
    App.handleRoute(hash);
  },

  navigate(page) {
    location.hash = page;
  },
};

window.Router = Router;
