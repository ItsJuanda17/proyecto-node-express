#!/bin/bash
# Script de despliegue para Railway con Bun

echo "🚀 Preparando despliegue en Railway..."

# 1. Verificar que estés en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

# 2. Instalar dependencias con Bun
echo "📦 Instalando dependencias con Bun..."
bun install

# 3. Probar que la aplicación compile/funcione
echo "🧪 Probando la aplicación..."
timeout 10s bun run index.ts &
PROC_PID=$!
sleep 5
if kill -0 $PROC_PID 2>/dev/null; then
    echo "✅ La aplicación se ejecuta correctamente"
    kill $PROC_PID
else
    echo "❌ Error: La aplicación no se ejecuta correctamente"
    exit 1
fi

# 4. Probar Docker build
echo "🐳 Probando Docker build..."
docker build -t proyecto-railway-test . || {
    echo "❌ Error en Docker build"
    exit 1
}

echo "✅ Todo listo para desplegar en Railway!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube tu código a GitHub"
echo "2. Ve a railway.app y conecta tu repositorio"
echo "3. Configura las variables de entorno:"
echo "   - MONGODB_URI (MongoDB Atlas)"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo "4. ¡Despliega!"