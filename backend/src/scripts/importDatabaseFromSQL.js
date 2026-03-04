/**
 * Script para importar la base de datos desde create_tables.sql
 * Ejecuta el archivo SQL completo en la base de datos
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getInstance } = require('../infrastructure/database/connection');

async function importDatabase() {
  console.log('🚀 Iniciando importación de base de datos...\n');
  
  const db = getInstance();
  
  try {
    // Conectar a la base de datos
    await db.connect();
    console.log('✅ Conexión establecida\n');

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, '../infrastructure/database/create_tables.sql');
    console.log(`📄 Leyendo archivo: ${sqlFilePath}\n`);
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Dividir el contenido en statements individuales
    // Eliminar comentarios y líneas vacías
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Filtrar comentarios y líneas vacías
        return stmt.length > 0 && 
               !stmt.startsWith('--') && 
               !stmt.startsWith('/*') &&
               stmt !== 'USE gestion_corporativa_pulida' &&
               !stmt.includes('CREATE DATABASE');
      });

    console.log(`📊 Total de statements a ejecutar: ${statements.length}\n`);
    console.log('⏳ Ejecutando statements...\n');

    let successCount = 0;
    let errorCount = 0;
    let currentTable = '';

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement) continue;

      try {
        // Detectar qué tabla se está procesando
        if (statement.toUpperCase().includes('DROP TABLE')) {
          const match = statement.match(/DROP TABLE IF EXISTS (\w+)/i);
          if (match) {
            currentTable = match[1];
            console.log(`🗑️  Eliminando tabla: ${currentTable}`);
          }
        } else if (statement.toUpperCase().includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE (\w+)/i);
          if (match) {
            currentTable = match[1];
            console.log(`📦 Creando tabla: ${currentTable}`);
          }
        } else if (statement.toUpperCase().includes('INSERT INTO')) {
          const match = statement.match(/INSERT INTO (\w+)/i);
          if (match && match[1] !== currentTable) {
            currentTable = match[1];
            console.log(`📝 Insertando datos en: ${currentTable}`);
          }
        }

        await db.query(statement + ';');
        successCount++;

        // Mostrar progreso cada 50 statements
        if ((i + 1) % 50 === 0) {
          console.log(`   Progreso: ${i + 1}/${statements.length} (${((i + 1) / statements.length * 100).toFixed(1)}%)`);
        }

      } catch (error) {
        errorCount++;
        
        // Solo mostrar errores críticos (no los de "tabla no existe" en DROP)
        if (!error.message.includes('Unknown table') && 
            !error.message.includes("doesn't exist")) {
          console.error(`\n❌ Error en statement ${i + 1}:`);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}\n`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE IMPORTACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Statements exitosos: ${successCount}`);
    console.log(`❌ Statements con error: ${errorCount}`);
    console.log(`📈 Tasa de éxito: ${(successCount / statements.length * 100).toFixed(2)}%`);
    console.log('='.repeat(60) + '\n');

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas creadas...\n');
    const tables = await db.query('SHOW TABLES');
    console.log(`✅ Total de tablas en la base de datos: ${tables.length}\n`);
    
    console.log('📋 Tablas creadas:');
    tables.forEach((table, idx) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${idx + 1}. ${tableName}`);
    });

    console.log('\n✅ Importación completada exitosamente!\n');

  } catch (error) {
    console.error('\n❌ Error fatal durante la importación:');
    console.error(error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Ejecutar
importDatabase();
