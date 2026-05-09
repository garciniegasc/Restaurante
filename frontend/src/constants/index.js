const ROLES = {
  ADMIN: 'admin',
  MESERO: 'mesero',
  CLIENTE: 'cliente',
};

const ROLES_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MESERO]: 'Mesero',
  [ROLES.CLIENTE]: 'Cliente',
};

const ORDER_STATUS = {
  PENDIENTE: 'pendiente',
  PREPARACION: 'preparacion',
  ENTREGADO: 'entregado',
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDIENTE]: 'Pendiente',
  [ORDER_STATUS.PREPARACION]: 'En Preparación',
  [ORDER_STATUS.ENTREGADO]: 'Entregado',
};

const PAYMENT_METHODS = ['efectivo', 'tarjeta', 'transferencia'];
const TAX_RATE = 0.19;

const PAGES_BY_ROLE = {
  [ROLES.ADMIN]: ['dashboard', 'menu', 'orders', 'kitchen', 'reservations', 'billing', 'reports', 'users'],
  [ROLES.MESERO]: ['orders', 'menu', 'kitchen', 'reservations', 'billing'],
  [ROLES.CLIENTE]: ['menu', 'orders', 'reservations'],
};

window.ROLES = ROLES;
window.ORDER_STATUS = ORDER_STATUS;
window.PAYMENT_METHODS = PAYMENT_METHODS;
window.TAX_RATE = TAX_RATE;
window.PAGES_BY_ROLE = PAGES_BY_ROLE;
