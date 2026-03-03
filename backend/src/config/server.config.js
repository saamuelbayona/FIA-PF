/**
 * Configuración del Servidor
 * @module config/server
 */

// JWT_SECRET es obligatorio en producción
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET no está configurado. Configúralo en las variables de entorno.');
}

module.exports = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h'
};
