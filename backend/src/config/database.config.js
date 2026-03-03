/**
 * Configuración de Base de Datos
 * Railway: usa MYSQL_URL (recomendado) o variables MYSQL*
 * Local: usa DB_* o fallback localhost
 * @module config/database
 */

// Railway inyecta MYSQL_URL - conectar por URL tiene prioridad
const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (mysqlUrl) {
  module.exports = {
    uri: mysqlUrl,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
} else {
  module.exports = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'yamanote.proxy.rlwy.net',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'KqtsrycynMDaFOIGsBwryJrhnyzyOWYc',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '13602', 10),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
}
