/**
 * Script para limpiar la base de datos y luego importar desde create_tables.sql
 * 1. Elimina todas las tablas existentes
 * 2. Ejecuta el archivo SQL completo
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getInstance } = require('../infrastructure/database/connection');

async function cleanAndImportDatabase() {
  console.log('🚀 Iniciando limpieza e importación de base de datos...\n');
  
  const db = getInstance();
  
  try {
    // Conectar a la base de datos
    await db.connect();
    console.log('✅ Conexión establecida\n');

    // PASO 1: Eliminar todas las tablas existentes
    console.log('🗑️  PASO 1: Eliminando tablas antiguas...\n');
    
    const tables = await db.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    console.log(`📊 Tablas encontradas: ${tableNames.length}\n`);
    
    if (tableNames.length > 0) {
      // Desactivar foreign key checks temporalmente
      await db.query('SET FOREIGN_KEY_CHECKS = 0');
      
      for (const tableName of tableNames) {
        try {
          console.log(`   🗑️  Eliminando: ${tableName}`);
          await db.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        } catch (error) {
          console.error(`   ❌ Error eliminando ${tableName}: ${error.message}`);
        }
      }
      
      // Reactivar foreign key checks
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
      
      console.log('\n✅ Todas las tablas antiguas eliminadas\n');
    } else {
      console.log('ℹ️  No hay tablas para eliminar\n');
    }

    // PASO 2: Importar desde SQL
    console.log('📥 PASO 2: Importando nueva estructura...\n');
    
    const sqlFilePath = path.join(__dirname, '../infrastructure/database/create_tables.sql');
    console.log(`📄 Leyendo archivo: ${sqlFilePath}\n`);
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Dividir el contenido en statements individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
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
    let insertCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement) continue;

      try {
        // Detectar qué tabla se está procesando
        if (statement.toUpperCase().includes('DROP TABLE')) {
          const match = statement.match(/DROP TABLE IF EXISTS (\w+)/i);
          if (match) {
            currentTable = match[1];
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
            if (insertCount > 0) {
              console.log(`   ✅ ${insertCount} registros insertados en ${currentTable}`);
            }
            currentTable = match[1];
            insertCount = 0;
            console.log(`📝 Insertando datos en: ${currentTable}`);
          }
          insertCount++;
        }

        await db.query(statement + ';');
        successCount++;

        // Mostrar progreso cada 100 statements
        if ((i + 1) % 100 === 0) {
          console.log(`   Progreso: ${i + 1}/${statements.length} (${((i + 1) / statements.length * 100).toFixed(1)}%)`);
        }

      } catch (error) {
        errorCount++;
        
        // Solo mostrar errores críticos
        if (!error.message.includes('Unknown table') && 
            !error.message.includes("doesn't exist")) {
          console.error(`\n❌ Error en statement ${i + 1}:`);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}\n`);
        }
      }
    }

    if (insertCount > 0) {
      console.log(`   ✅ ${insertCount} registros insertados en ${currentTable}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE IMPORTACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Statements exitosos: ${successCount}`);
    console.log(`❌ Statements con error: ${errorCount}`);
    console.log(`📈 Tasa de éxito: ${(successCount / statements.length * 100).toFixed(2)}%`);
    console.log('='.repeat(60) + '\n');

    // PASO 3: Verificar tablas creadas
    console.log('🔍 PASO 3: Verificando tablas creadas...\n');
    const newTables = await db.query('SHOW TABLES');
    console.log(`✅ Total de tablas en la base de datos: ${newTables.length}\n`);
    
    console.log('📋 Tablas creadas:');
    for (let i = 0; i < newTables.length; i++) {
      const tableName = Object.values(newTables[i])[0];
      
      // Contar registros en cada tabla
      try {
        const [countResult] = await db.query(`SELECT COUNT(*) as total FROM \`${tableName}\``);
        const count = countResult.total || 0;
        console.log(`   ${i + 1}. ${tableName.padEnd(40)} (${count} registros)`);
      } catch (error) {
        console.log(`   ${i + 1}. ${tableName.padEnd(40)} (error al contar)`);
      }
    }

    console.log('\n✅ ¡Limpieza e importación completada exitosamente!\n');

  } catch (error) {
    console.error('\n❌ Error fatal durante la importación:');
    console.error(error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Ejecutar
cleanAndImportDatabase();
