# SIGR - Sistema Integral de Gestión de Restaurante

Sistema web completo para la administración de restaurantes con módulos de autenticación, menú, pedidos, cocina, reservas, facturación y reportes.

## 🚀 Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** JWT + bcrypt

## 📋 Requisitos

- Node.js 18+
- MySQL 8+
- Navegador web moderno

## ⚙️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sigr.git
cd sigr

# Instalar dependencias del backend
cd backend
npm install

# Configurar variables de entorno
cp config/env.example .env
# Editar .env con tus credenciales

# Importar base de datos
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# Iniciar servidor
npm run dev
```

Abrir `frontend/index.html` en el navegador o servir con un servidor estático.

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@restaurant.com | admin123 |
| Mesero | mesero@restaurant.com | mesero123 |
| Cliente | cliente@restaurant.com | cliente123 |

## 🧱 Estructura del Proyecto

```
SIGR/
├── frontend/       # Aplicación SPA (HTML, CSS, JS)
├── backend/        # API REST (Node.js + Express)
├── database/       # Esquema y datos iniciales SQL
├── docs/           # Documentación
└── tests/          # Pruebas unitarias y de integración
```

## 📦 Módulos

- 🔐 Autenticación con roles (Admin, Mesero, Cliente)
- 🍽️ Gestión de menú y productos
- 📝 Pedidos en tiempo real
- 👨‍🍳 Vista de cocina
- 📅 Reservas
- 💰 Facturación
- 📊 Reportes de ventas

## 🧪 Pruebas

```bash
npm test
```
