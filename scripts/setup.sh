#!/bin/bash
echo "=== SIGR - Setup ==="
echo ""

# Backend setup
echo "[1/4] Instalando dependencias del backend..."
cd backend
npm install
cd ..

# Database setup
echo "[2/4] Configurando base de datos..."
echo "Ejecuta: mysql -u root -p < database/migrations/001_create_roles.sql"
echo "Luego ejecuta los migrations en orden numérico y los seeds."

# Frontend setup  
echo "[3/4] Frontend listo (no requiere instalación)..."
echo "Abre frontend/index.html en tu navegador."

# Environment
echo "[4/4] Configurando variables de entorno..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Archivo .env creado desde .env.example"
fi

echo ""
echo "=== Setup completado ==="
