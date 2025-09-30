import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './src/config/database';
import routes from './src/routes';
import { errorHandler, notFound } from './src/middleware';
import { createSuperAdmin } from './src/utils';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(limiter);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Backend - Sistema de Usuarios',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth/login',
      register: '/api/auth/register',
      profile: '/api/users/profile',
      users: '/api/users',
      projects: '/api/projects',
      tasks: '/api/tasks'
    }
  });
});

// Rutas de la API
app.use('/api', routes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Para Vercel, inicializar la conexión DB de forma diferente
let dbConnected = false;

const initializeDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      await createSuperAdmin();
      dbConnected = true;
      console.log('[VERCEL] Base de datos inicializada');
    } catch (error) {
      console.log('[VERCEL] Error en DB, continuando sin base de datos:', error);
    }
  }
};

// Middleware para inicializar DB en cada request (Vercel serverless)
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[SERVER] http://localhost:${PORT}`);
  });
}

// Export para Vercel
export default app;