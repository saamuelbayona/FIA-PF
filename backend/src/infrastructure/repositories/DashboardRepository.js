const IDashboardRepository = require('../../domain/repositories/IDashboardRepository');
const { getInstance } = require('../database/connection');

class DashboardRepository extends IDashboardRepository {
  
  // FUENTES Y USOS (Balance General) - Comparativa 2024 vs 2025
  async getFuentesUsos() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        category as tipo,
        subcategory as subcategoria,
        account_name as categoria,
        value_2025 as valor_2025,
        value_2024 as valor_2024,
        variation as variacion,
        fuentes,
        usos
      FROM financial_data
      ORDER BY category, subcategory, account_name
    `);
    return rows;
  }

  // GESTIÓN DE CARTERA - Comparativa mensual con datos 2024 y 2025
  async getGestionCartera() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        mes,
        total_cartera,
        cartera_vencida,
        indice_mora,
        rotacion_dias,
        ventas_contado,
        ventas_credito,
        exp_millones_2025,
        exp_millones_2024
      FROM fin_cartera
      ORDER BY FIELD(mes, 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre')
    `);
    return rows;
  }

  // GESTIÓN COMERCIAL - Ventas por línea 2024 vs 2025
  async getGestionComercial() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        linea,
        categoria,
        kg_2025,
        kg_2024,
        pct_participacion,
        cumplimiento_meta
      FROM com_ventas_sede1
      ORDER BY kg_2025 DESC
    `);
    return rows;
  }

  // GESTIÓN HUMANA - Comparativa 2024 vs 2025
  async getGestionHumana() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        concepto,
        valor_2024,
        valor_2025,
        cantidad_horas
      FROM rh_gestion_talento
      ORDER BY valor_2025 DESC
    `);
    return rows;
  }

  // GESTIÓN LOGÍSTICA - Comparativa 2024 vs 2025
  async getGestionLogistica() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        sede_id,
        concepto,
        valor_2024,
        valor_2025
      FROM log_gastos_sedes
      ORDER BY sede_id, concepto
    `);
    return rows;
  }

  // PRODUCCIÓN - Capacidad de Granjas
  async getProduccionGranjas() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        tipo_clima as tipo,
        nombre_granja as granja,
        metros_cuadrados as metros,
        capacidad_aves as aves
      FROM prod_capacidad_instalada
      ORDER BY tipo_clima, nombre_granja
    `);
    return rows;
  }

  // PRODUCCIÓN - Histórico de Sacrificio 2024 vs 2025
  async getProduccionHistorico() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        mes,
        prog_2024,
        real_2024,
        encasetado_real_2025
      FROM prod_historico_sacrificio
      ORDER BY FIELD(mes, 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
    `);
    return rows;
  }

  // SISTEMA SAGRILAFT
  async getSistemaSagrilaft() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        contraparte,
        rechazados,
        pct_la_ft,
        pct_falla_doc,
        pct_antecedentes
      FROM cumplimiento_sagrilaft
      ORDER BY rechazados DESC
    `);
    return rows;
  }

  // GESTIÓN GERENCIA ESTRATÉGICA
  async getGestionGerencia() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        indicador,
        resultado
      FROM gerencia_estrategica
      ORDER BY indicador
    `);
    return rows;
  }
}

module.exports = DashboardRepository;
