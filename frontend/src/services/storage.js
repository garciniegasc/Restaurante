const BASE_PRODUCTS = [
  { id: 1, nombre: 'Ceviche Clásico', descripcion: 'Ceviche de pescado con limón y cebolla', precio: 12000, categoriaId: 1, disponible: true },
  { id: 2, nombre: 'Empanadas (x3)', descripcion: 'Empanadas de carne y queso', precio: 8000, categoriaId: 1, disponible: true },
  { id: 3, nombre: 'Patacones con Hogao', descripcion: 'Patacones crujientes con hogao tradicional', precio: 7000, categoriaId: 1, disponible: true },
  { id: 4, nombre: 'Arepas de Queso (x2)', descripcion: 'Arepas rellenas de queso fundido', precio: 5000, categoriaId: 1, disponible: true },
  { id: 5, nombre: 'Bandeja Paisa', descripcion: 'Frijoles, arroz, carne, chicharrón, plátano, huevo, aguacate', precio: 25000, categoriaId: 2, disponible: true },
  { id: 6, nombre: 'Filete de Res', descripcion: 'Filete con papas y verduras salteadas', precio: 28000, categoriaId: 2, disponible: true },
  { id: 7, nombre: 'Sancocho de Gallina', descripcion: 'Sancocho tradicional con gallina criolla, yuca, plátano y mazorca', precio: 22000, categoriaId: 2, disponible: true },
  { id: 8, nombre: 'Ajiaco Santafereño', descripcion: 'Sopa de pollo con tres papas, mazorca, guascas y alcaparras', precio: 20000, categoriaId: 2, disponible: true },
  { id: 9, nombre: 'Pescado Frito', descripcion: 'Pescado frito entero con patacones, arroz y ensalada', precio: 30000, categoriaId: 2, disponible: true },
  { id: 10, nombre: 'Bistec a Caballo', descripcion: 'Bistec jugoso con huevo frito, arroz, patacones y ensalada', precio: 24000, categoriaId: 2, disponible: true },
  { id: 11, nombre: 'Jugo Natural', descripcion: 'Jugo de fruta fresca del día', precio: 5000, categoriaId: 3, disponible: true },
  { id: 12, nombre: 'Gaseosa', descripcion: 'Bebida carbonatada 355ml', precio: 3000, categoriaId: 3, disponible: true },
  { id: 13, nombre: 'Café', descripcion: 'Café colombiano recién preparado', precio: 3500, categoriaId: 3, disponible: true },
  { id: 14, nombre: 'Limonada Natural', descripcion: 'Limonada fresca con hierbabuena y hielo', precio: 4000, categoriaId: 3, disponible: true },
  { id: 15, nombre: 'Cerveza', descripcion: 'Cerveza fría 330ml', precio: 6000, categoriaId: 3, disponible: true },
  { id: 16, nombre: 'Agua sin Gas', descripcion: 'Agua embotellada 500ml', precio: 2500, categoriaId: 3, disponible: true },
  { id: 17, nombre: 'Flan Casero', descripcion: 'Flan de caramelo con crema', precio: 7000, categoriaId: 4, disponible: true },
  { id: 18, nombre: 'Brownie con Helado', descripcion: 'Brownie de chocolate con helado de vainilla', precio: 9000, categoriaId: 4, disponible: true },
  { id: 19, nombre: 'Tres Leches', descripcion: 'Pastel bañado en tres leches con crema chantillí', precio: 8000, categoriaId: 4, disponible: true },
];
const BASE_PRODUCT_NEXT_ID = 20;

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
          { productoId: 6, nombre: 'Filete de Res', cantidad: 1, precio: 28000 },
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
    this.set('productos', BASE_PRODUCTS);
    this.set('mesas', mesas);
    this.set('pedidos', pedidos);
    this.set('reservas', []);
    this.set('facturas', facturas);
    this.set('nextId', { usuarios: 4, categorias: 5, productos: BASE_PRODUCT_NEXT_ID, mesas: 7, pedidos: 2, reservas: 1, facturas: 2 });
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

// Migration: ensure nextId has all required keys
const NEXT_ID_KEYS = { usuarios: 4, categorias: 5, productos: BASE_PRODUCT_NEXT_ID, mesas: 7, pedidos: 2, reservas: 1, facturas: 2 };
const existingNextId = DB.get('nextId');
if (existingNextId) {
  let changed = false;
  for (const [key, val] of Object.entries(NEXT_ID_KEYS)) {
    if (!(key in existingNextId)) {
      existingNextId[key] = val;
      changed = true;
    }
  }
  if (changed) DB.set('nextId', existingNextId);
}

// Migration: add missing base products for existing users
const existingProductos = DB.get('productos') || [];
const existingIds = new Set(existingProductos.map(p => p.id));
const nuevos = BASE_PRODUCTS.filter(p => !existingIds.has(p.id));
if (nuevos.length > 0) {
  DB.set('productos', [...existingProductos, ...nuevos]);
}

// Migration: ensure nextId for productos is at least BASE_PRODUCT_NEXT_ID
const nextIdData = DB.get('nextId');
if (nextIdData && nextIdData.productos < BASE_PRODUCT_NEXT_ID) {
  nextIdData.productos = BASE_PRODUCT_NEXT_ID;
  DB.set('nextId', nextIdData);
}

DB.seed();
