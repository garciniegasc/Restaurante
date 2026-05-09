const ROLES = Object.freeze({
  ADMIN: 1,
  MESERO: 2,
  CLIENTE: 3,
});

const ROLE_NAMES = Object.freeze({
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.MESERO]: 'Mesero',
  [ROLES.CLIENTE]: 'Cliente',
});

module.exports = { ROLES, ROLE_NAMES };
