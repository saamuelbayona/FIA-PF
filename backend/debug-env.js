// Script para debuggear variables de entorno
require('dotenv').config();

console.log('\n🔍 Variables de Entorno Cargadas:\n');
console.log('MYSQLHOST:', process.env.MYSQLHOST || 'NO DEFINIDO');
console.log('MYSQLUSER:', process.env.MYSQLUSER || 'NO DEFINIDO');
console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '****' + process.env.MYSQLPASSWORD.slice(-4) : 'NO DEFINIDO');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'NO DEFINIDO');
console.log('MYSQLPORT:', process.env.MYSQLPORT || 'NO DEFINIDO');
console.log('MYSQL_URL:', process.env.MYSQL_URL || 'NO DEFINIDO');
console.log('\nPORT:', process.env.PORT || 'NO DEFINIDO');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NO DEFINIDO');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '****' : 'NO DEFINIDO');

console.log('\n📋 Configuración que se usará:\n');
const dbConfig = require('./src/config/database.config');
console.log(JSON.stringify(dbConfig, null, 2));
