# Script de despliegue para Railway con Bun (PowerShell)

Write-Host "🚀 Preparando despliegue en Railway..." -ForegroundColor Green

# 1. Verificar que estés en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# 2. Instalar dependencias con Bun
Write-Host "📦 Instalando dependencias con Bun..." -ForegroundColor Yellow
bun install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

# 3. Probar Docker build
Write-Host "🐳 Probando Docker build..." -ForegroundColor Yellow
docker build -t proyecto-railway-test .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en Docker build" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Todo listo para desplegar en Railway!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Sube tu código a GitHub" -ForegroundColor White
Write-Host "2. Ve a railway.app y conecta tu repositorio" -ForegroundColor White
Write-Host "3. Configura las variables de entorno:" -ForegroundColor White
Write-Host "   - MONGODB_URI (MongoDB Atlas)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET" -ForegroundColor Gray
Write-Host "   - NODE_ENV=production" -ForegroundColor Gray
Write-Host "4. ¡Despliega!" -ForegroundColor White