# Guía de Despliegue

## Despliegue Local

### Frontend
```bash
# Opción 1: Servir con Node.js
npx serve frontend/

# Opción 2: Servir con Python
python -m http.server 8000 -d frontend/
```

### Backend
```bash
cd backend
npm install
cp config/env.example .env
# Configurar variables de entorno
npm start
```

## Despliegue en Producción

### Usando Docker
```bash
docker-compose up -d
```

### Usando PM2 (Node.js)
```bash
npm install -g pm2
cd backend
pm2 start app.js --name sigr-api
pm2 save
pm2 startup
```

### Variables de Entorno
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secure_password
DB_NAME=sigr_db
JWT_SECRET=secure_random_string
```

## Requisitos del Servidor
- Node.js 18+
- MySQL 8+
- 1GB RAM mínimo
- 10GB almacenamiento
