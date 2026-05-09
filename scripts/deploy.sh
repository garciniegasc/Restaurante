#!/bin/bash
echo "=== SIGR - Deploy ==="
echo ""

# Build and run with Docker
echo "Construyendo imágenes Docker..."
docker-compose -f docker/docker-compose.yml build

echo "Iniciando servicios..."
docker-compose -f docker/docker-compose.yml up -d

echo ""
echo "=== SIGR desplegado ==="
echo "Frontend: http://localhost:80"
echo "Backend:  http://localhost:3000/api/health"
