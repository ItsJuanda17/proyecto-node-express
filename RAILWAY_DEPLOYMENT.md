# 🚀 Despliegue en Railway con Bun

Este proyecto está configurado para desplegarse en Railway usando **Bun** (mucho más rápido que Node.js) y MongoDB Atlas.

## 📋 Prerrequisitos

1. **Cuenta en Railway** - [railway.app](https://railway.app)
2. **Cuenta en MongoDB Atlas** - [cloud.mongodb.com](https://cloud.mongodb.com) (gratis)
3. **Git repository** - Tu código debe estar en GitHub/GitLab
4. **Bun instalado localmente** (opcional) - [bun.sh](https://bun.sh)

## 🗃️ Configuración de MongoDB Atlas

1. Crea una cuenta gratuita en MongoDB Atlas
2. Crea un nuevo cluster (tier gratuito)
3. Configura un usuario de base de datos
4. Agrega tu IP a la whitelist (o permite todas: 0.0.0.0/0 para Railway)
5. Obtén la cadena de conexión

```
mongodb+srv://usuario:password@cluster.mongodb.net/proyecto_backend?retryWrites=true&w=majority
```

## 🚂 Despliegue en Railway

### Método 1: Desde el Dashboard

1. Ve a [railway.app](https://railway.app) y haz login
2. Clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Railway detectará automáticamente el Dockerfile (configurado para Bun)

### Método 2: Railway CLI

```bash
# Instalar Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

## ⚙️ Variables de Entorno en Railway

Configura estas variables en el dashboard de Railway:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | `tu-secret-muy-seguro` | Clave secreta para JWT (genera una fuerte) |
| `NODE_ENV` | `production` | Entorno de producción |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Ventana de rate limiting (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Máximo de requests por ventana |
| `BCRYPT_SALT_ROUNDS` | `12` | Rounds para bcrypt |

> **Nota**: Railway configura automáticamente la variable `PORT`, no la agregues manualmente.

## 🔧 Comandos Útiles

```bash
# Desarrollo con Bun (hot reload)
bun run dev

# Ejecutar en producción localmente
bun start

# Construir para producción (opcional con Bun)
bun run build

# Previsualizar build
bun run preview

# Docker
bun run docker:build
bun run docker:run

# Ver logs en Railway
railway logs

# Conectar terminal a Railway
railway shell
```

## 🐳 Dockerfile con Bun

El proyecto incluye un Dockerfile optimizado para Bun que:

- Usa la imagen oficial de Bun (oven/bun:1)
- Es mucho más rápido que Node.js para instalación y ejecución
- Ejecuta TypeScript directamente sin compilación previa
- Incluye usuario no-root por seguridad
- Expone el puerto 3000
- Healthcheck optimizado para Bun

### Ventajas de Bun sobre Node.js:
- ⚡ **3x más rápido** en instalación de dependencias
- 🚀 **Ejecución directa** de TypeScript sin compilación
- 📦 **Bundler integrado** (opcional)
- � **Compatible** con APIs de Node.js
- 💾 **Menor uso** de memoria

## �📝 Notas Importantes

1. **MongoDB**: Railway recomienda usar MongoDB Atlas en lugar de ejecutar MongoDB en el mismo contenedor
2. **Bun Runtime**: Railway soporta oficialmente Bun desde 2024
3. **Logs**: Puedes ver los logs en tiempo real desde el dashboard de Railway
4. **Dominio**: Railway te proporcionará un dominio gratuito (.railway.app)
5. **SSL**: Railway maneja automáticamente los certificados SSL
6. **Escalado**: Railway puede escalar automáticamente tu aplicación
7. **Hot Reload**: En desarrollo local, Bun ofrece hot reload muy rápido

## 🔍 Troubleshooting

### Error de conexión a MongoDB
- Verifica que la cadena de conexión sea correcta
- Asegúrate de que la IP 0.0.0.0/0 esté en la whitelist de MongoDB Atlas
- Verifica las credenciales del usuario de la base de datos

### Error en el build con Bun
- Revisa los logs de construcción en Railway
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que el `bun.lockb` esté actualizado (ejecuta `bun install`)

### La aplicación no inicia
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de la aplicación en Railway
- Asegúrate de que el puerto sea el correcto (Railway lo asigna automáticamente)

### Problemas específicos de Bun
- Si una dependencia no es compatible con Bun, puedes usar `--backend=node` en `bun install`
- Para debugging, puedes usar `console.log` o el debugger integrado de Bun

## 🌟 Features del Proyecto

- ✅ Express.js con TypeScript
- ✅ **Bun Runtime** (ultra rápido)
- ✅ MongoDB con Mongoose
- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Middleware de seguridad (Helmet, CORS)
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Docker ready con Bun
- ✅ Railway deployment ready
- ✅ Hot reload en desarrollo
- ✅ TypeScript sin compilación