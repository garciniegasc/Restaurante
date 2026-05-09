const Store = {
  state: {
    currentUser: null,
    pedidos: [],
    productos: [],
    categorias: [],
    mesas: [],
    reservas: [],
    facturas: [],
  },

  init() {
    this.state.pedidos = DB.get('pedidos') || [];
    this.state.productos = DB.get('productos') || [];
    this.state.categorias = DB.get('categorias') || [];
    this.state.mesas = DB.get('mesas') || [];
    this.state.reservas = DB.get('reservas') || [];
    this.state.facturas = DB.get('facturas') || [];
  },

  get(key) { return this.state[key]; },

  refresh() { this.init(); },
};
window.Store = Store;
