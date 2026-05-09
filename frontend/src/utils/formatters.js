const Formatters = {
  currency(value) {
    return `$${(value || 0).toLocaleString('es-CO')}`;
  },

  date(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  },

  datetime(dateStr) {
    return new Date(dateStr).toLocaleString('es-CO');
  },

  time(dateStr) {
    return new Date(dateStr).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit',
    });
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
window.Formatters = Formatters;
