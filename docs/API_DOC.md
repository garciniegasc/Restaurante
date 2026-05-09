# API REST - Documentación

Base URL: `http://localhost:3000/api`

## Autenticación

### POST /auth/login
```json
// Request
{ "email": "admin@restaurant.com", "password": "admin123" }
// Response
{ "token": "eyJ...", "user": { "id": 1, "nombre": "Admin", "email": "admin@restaurant.com", "rol_id": 1 } }
```

### GET /auth/me
Headers: `Authorization: Bearer <token>`

## Menú

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /menu | Listar productos |
| GET | /menu/:id | Obtener producto |
| POST | /menu | Crear producto |
| PUT | /menu/:id | Actualizar producto |
| DELETE | /menu/:id | Eliminar producto |
| PATCH | /menu/:id/availability | Alternar disponibilidad |

## Pedidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /orders | Listar pedidos |
| GET | /orders/:id | Obtener pedido |
| POST | /orders | Crear pedido |
| PATCH | /orders/:id/status | Actualizar estado |

## Reservas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /reservations | Listar reservas |
| POST | /reservations | Crear reserva |
| PATCH | /reservations/:id/status | Actualizar estado |
| DELETE | /reservations/:id | Eliminar reserva |

## Facturación

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /billing | Listar facturas |
| GET | /billing/:id | Obtener factura |
| POST | /billing | Generar factura |

## Reportes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /reports/daily-sales | Ventas del día |
| GET | /reports/product-sales | Ventas por producto |
| GET | /reports/revenue | Ingresos por período |
| GET | /reports/cash-summary | Resumen de caja |
