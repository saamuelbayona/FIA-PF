/**
 * Script de Prueba de Conexión a Base de Datos
 * Ejecuta: node test-connection.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = require('./src/config/database.config');

async function testConnection() {
  console.log('\n🔍 Probando conexión a la base de datos...\n');
  
  // Mostrar configuración (sin mostrar password completo)
  console.log('📋 Configuración detectada:');
  if (dbConfig.uri) {
    console.log('   Modo: URL completa (Railway)');
    console.log(`   URL: ${dbConfig.uri.replace(/:[^:@]+@/, ':****@')}`);
  } else {
    console.log('   Modo: Variables individuales');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Password: ${dbConfig.password ? '****' + dbConfig.password.slice(-4) : 'NO CONFIGURADO'}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Port: ${dbConfig.port}`);
  }
  
  console.log('\n⏳ Intentando conectar...\n');

  try {
    let connection;
    
    if (dbConfig.uri) {
      // Conexión por URL (Railway)
      connection = await mysql.createConnection(dbConfig.uri);
    } else {
      // Conexión por variables individuales
      connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        port: dbConfig.port
      });
    }

    console.log('✅ Conexión exitosa!\n');

    // Probar una query simple
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Usuarios en la base de datos: ${rows[0].count}`);

    // Verificar tablas
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n📁 Tablas encontradas (${tables.length}):`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    await connection.end();
    console.log('\n✅ Prueba completada exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error de conexión:\n');
    console.error(`   Tipo: ${error.code || 'UNKNOWN'}`);
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Sugerencia: Verifica que el host sea correcto');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Sugerencia: Verifica usuario y contraseña');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Sugerencia: Verifica que el puerto sea correcto y el servidor MySQL esté corriendo');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Sugerencia: La base de datos no existe, créala primero');
    }
    
    console.error('\n📝 Checklist:');
    console.error('   [ ] ¿Existe el archivo backend/.env?');
    console.error('   [ ] ¿Las credenciales son correctas?');
    console.error('   [ ] ¿El servidor MySQL está corriendo?');
    console.error('   [ ] ¿El puerto es el correcto?');
    console.error('   [ ] ¿La base de datos existe?\n');
    
    process.exit(1);
  }
}

testConnection();
