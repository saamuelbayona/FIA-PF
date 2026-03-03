require('dotenv').config();
const csvLoader = require('../infrastructure/csv/csvLoader');
const { getInstance } = require('../infrastructure/database/connection');

async function loadData() {
  try {
    console.log('🚀 Iniciando carga de datos CSV...\n');
    
    const db = getInstance();
    await db.connect();
    
    await csvLoader.loadAllCSVs();
    
    console.log('\n✅ Datos cargados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

loadData();
