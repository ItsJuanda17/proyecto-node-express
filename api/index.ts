import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from '../src/config/database';
import routes from '../src/routes';
import { errorHandler, notFound } from '../src/middleware';
import { createSuperAdmin } from '../src/utils';

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

// Para Vercel, inicializar la conexión DB de forma diferente
let dbConnected = false;

const initializeDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      await createSuperAdmin();
      dbConnected = true;
      console.log('[VERCEL] Base de datos inicializada correctamente');
    } catch (error) {
      console.log('[VERCEL] Error en DB:', error);
      // No detener la aplicación si falla la DB
    }
  }
};

// Middleware para inicializar DB en cada request (Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await initializeDB();
  } catch (error) {
    console.log('[VERCEL] Error inicializando DB:', error);
  }
  next();
});

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Backend - Sistema de Usuarios y Proyectos',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Conectada' : 'Desconectada',
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

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    database: dbConnected ? 'Conectada' : 'Desconectada',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api', routes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Export para Vercel
export default app;