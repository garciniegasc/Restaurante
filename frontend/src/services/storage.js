const DB = {
  get(key) {
    const data = localStorage.getItem(`sigr_${key}`);
    return data ? JSON.parse(data) : null;
  },
  set(key, value) {
    localStorage.setItem(`sigr_${key}`, JSON.stringify(value));
  },
  seed() {
    if (this.get('seed_initialized')) return;

    const usuarios = [
      { id: 1, nombre: 'Admin Principal', email: 'admin@restaurant.com', password: 'admin123', rol: 'admin' },
      { id: 2, nombre: 'Carlos Mesero', email: 'mesero@restaurant.com', password: 'mesero123', rol: 'mesero' },
      { id: 3, nombre: 'María Pérez', email: 'cliente@restaurant.com', password: 'cliente123', rol: 'cliente' },
    ];
    const categorias = [
      { id: 1, nombre: 'Entradas' },
      { id: 2, nombre: 'Platos Fuertes' },
      { id: 3, nombre: 'Bebidas' },
      { id: 4, nombre: 'Postres' },
    ];
    const productos = [
      { id: 1, nombre: 'Ceviche Clásico', descripcion: 'Ceviche de pescado con limón y cebolla', precio: 12000, categoriaId: 1, disponible: true },
      { id: 2, nombre: 'Empanadas (x3)', descripcion: 'Empanadas de carne y queso', precio: 8000, categoriaId: 1, disponible: true },
      { id: 3, nombre: 'Bandeja Paisa', descripcion: 'Frijoles, arroz, carne, chicharrón, plátano', precio: 25000, categoriaId: 2, disponible: true },
      { id: 4, nombre: 'Filete de Res', descripcion: 'Filete con papas y verduras salteadas', precio: 28000, categoriaId: 2, disponible: true },
      { id: 5, nombre: 'Jugo Natural', descripcion: 'Jugo de fruta fresca del día', precio: 5000, categoriaId: 3, disponible: true },
      { id: 6, nombre: 'Gaseosa', descripcion: 'Bebida carbonatada 355ml', precio: 3000, categoriaId: 3, disponible: true },
      { id: 7, nombre: 'Café', descripcion: 'Café colombiano recién preparado', precio: 3500, categoriaId: 3, disponible: true },
      { id: 8, nombre: 'Flan Casero', descripcion: 'Flan de caramelo con crema', precio: 7000, categoriaId: 4, disponible: true },
      { id: 9, nombre: 'Brownie con Helado', descripcion: 'Brownie de chocolate con helado de vainilla', precio: 9000, categoriaId: 4, disponible: true },
    ];
    const mesas = [
      { id: 1, numero: 1, capacidad: 2, estado: 'libre' },
      { id: 2, numero: 2, capacidad: 4, estado: 'libre' },
      { id: 3, numero: 3, capacidad: 4, estado: 'libre' },
      { id: 4, numero: 4, capacidad: 6, estado: 'libre' },
      { id: 5, numero: 5, capacidad: 8, estado: 'libre' },
      { id: 6, numero: 6, capacidad: 2, estado: 'libre' },
    ];
    const pedidos = [
      {
        id: 1, mesaId: 2, usuarioId: 2, fecha: new Date().toISOString(),
        estado: 'pendiente', total: 38000,
        items: [
          { productoId: 1, nombre: 'Ceviche Clásico', cantidad: 1, precio: 12000 },
          { productoId: 4, nombre: 'Filete de Res', cantidad: 1, precio: 28000 },
        ]
      },
    ];
    const facturas = [
      {
        id: 1, pedidoId: 1, fecha: new Date().toISOString(),
        subtotal: 38000, impuesto: 7220, total: 45220,
        metodoPago: 'efectivo', estado: 'pagada',
        clienteNombre: 'Juan García'
      },
    ];

    this.set('usuarios', usuarios);
    this.set('categorias', categorias);
    this.set('productos', productos);
    this.set('mesas', mesas);
    this.set('pedidos', pedidos);
    this.set('reservas', []);
    this.set('facturas', facturas);
    this.set('nextId', { productos: 10, pedidos: 2, reservas: 1, facturas: 2 });
    this.set('seed_initialized', true);
  },

  nextId(collection) {
    const ids = this.get('nextId');
    const id = ids[collection];
    ids[collection]++;
    this.set('nextId', ids);
    return id;
  },
};

DB.seed();
