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
        anio,
        total_cartera,
        total_vencida as cartera_vencida,
        indice_morosi as indice_mora,
        dias_rotacion as rotacion_dias,
        ventas_contado,
        ventas_credito,
        t2025_millones as exp_millones_2025,
        t2024_millones as exp_millones_2024,
        var_t_percent as variacion_pct,
        comentario
      FROM gestion_cartera
      WHERE anio = 2025
      ORDER BY FIELD(mes, 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                     'jul', 'ago', 'sep', 'oct', 'nov', 'dic')
    `);
    return rows;
  }

  // GESTIÓN COMERCIAL - Ventas Asadero y Sede 3 (2024 vs 2025)
  async getGestionComercial() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de asadero
    const [asadero] = await pool.query(`
      SELECT 
        'ASADERO' as sede,
        categoria,
        descripcion as linea,
        anio,
        total_kl as kg,
        total_part as participacion_pct,
        total_var as variacion_pct,
        precio_promedio,
        ingresos_totales,
        comentario
      FROM gestion_comercial_asadero
      WHERE categoria = 'VENTA_PRODUCTO'
      ORDER BY anio DESC, total_kl DESC
    `);
    
    // Obtener datos de sede 3
    const [sede3] = await pool.query(`
      SELECT 
        'SEDE3' as sede,
        categoria,
        descripcion as linea,
        anio,
        total_kl as kg,
        total_part as participacion_pct,
        variacion_kl,
        porcentaje_var as variacion_pct,
        precio,
        comentario
      FROM gestion_comercial_sede3
      WHERE categoria = 'VENTA_PRODUCTO'
      ORDER BY anio DESC, total_kl DESC
    `);
    
    return [...asadero, ...sede3];
  }

  // GESTIÓN HUMANA - Comparativa 2024 vs 2025
  async getGestionHumana() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        categor_a as categoria,
        descripci_n as concepto,
        a_o as anio,
        valor,
        __variaci_n as variacion_pct,
        variaci_n_absoluta as variacion_absoluta,
        narrativa
      FROM gestion_humana_2025
      ORDER BY categor_a, a_o
    `);
    return rows;
  }

  // GESTIÓN LOGÍSTICA - Comparativa 2024 vs 2025
  async getGestionLogistica() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        categoria,
        sede,
        concepto,
        anio,
        valor,
        variacion as variacion_pct,
        comentario
      FROM gestion_logistica
      ORDER BY sede, anio DESC, concepto
    `);
    return rows;
  }

  // PRODUCCIÓN - Capacidad de Granjas
  async getProduccionGranjas() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        tipo,
        granja,
        mts as metros,
        aves
      FROM capacidad_granjas
      ORDER BY tipo, granja
    `);
    return rows;
  }

  // PRODUCCIÓN - Histórico de Sacrificio y Encasetado
  async getProduccionHistorico() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de pollo sacrificado
    const [sacrificio] = await pool.query(`
      SELECT 
        'SACRIFICIO' as tipo,
        ano as anio,
        mes,
        prog as programado,
        valor_real as real,
        comprado,
        total,
        maximalim,
        progr_fiesta,
        entre_real_pf
      FROM pollo_sacrificado
      ORDER BY ano, FIELD(mes, 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
    `);
    
    // Obtener datos de encasetado
    const [encasetado] = await pool.query(`
      SELECT 
        'ENCASETADO' as tipo,
        ano as anio,
        mes,
        prog as programado,
        valor_real as real
      FROM encasetado
      ORDER BY ano, FIELD(mes, 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
    `);
    
    return [...sacrificio, ...encasetado];
  }

  // SISTEMA SAGRILAFT
  async getSistemaSagrilaft() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de stakeholders
    const [stakeholders] = await pool.query(`
      SELECT 
        contraparte,
        rechazados,
        la_pct,
        ft_pct,
        documentacion_pct,
        antecedentes_pct,
        peps_pct
      FROM sagrilaft_stakeholders
      ORDER BY rechazados DESC
    `);
    
    // Obtener totales
    const [totales] = await pool.query(`
      SELECT total_validados FROM sagrilaft_totales LIMIT 1
    `);
    
    // Obtener análisis detallado
    const [analisis] = await pool.query(`
      SELECT 
        categor_a as categoria,
        elemento,
        dato_principal,
        detalle_1,
        detalle_2,
        narrativa
      FROM analisis_sagrilaft_2025_2026
      ORDER BY categor_a, elemento
    `);
    
    return {
      stakeholders,
      totales: totales[0] || { total_validados: 0 },
      analisis
    };
  }

  // GESTIÓN GERENCIA ESTRATÉGICA
  async getGestionGerencia() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        secci_n as seccion,
        proceso,
        tema,
        descripci_n as descripcion,
        narrativa
      FROM gestion_gerencia_estrategica_2025
      ORDER BY secci_n, proceso, tema
    `);
    return rows;
  }

  // GESTIÓN AUDITORÍA - Merma y Devoluciones (2023-2025)
  async getGestionAuditoria() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de merma anual
    const [mermaAnual] = await pool.query(`
      SELECT 
        ano as anio,
        mes,
        valor as porcentaje_merma
      FROM merma_anual
      WHERE ano IN (2023, 2024, 2025)
      ORDER BY ano, mes
    `);
    
    // Obtener datos de devoluciones
    const [devoluciones] = await pool.query(`
      SELECT 
        ano as anio,
        mes,
        sede,
        devolucion_pct
      FROM auditoria_devoluciones
      WHERE ano IN (2024, 2025)
      ORDER BY ano, mes, sede
    `);
    
    // Obtener narrativas y comentarios
    const [narrativas] = await pool.query(`
      SELECT 
        categoria,
        anio,
        mes,
        sede,
        valor,
        comentario
      FROM gestion_auditoria
      WHERE categoria IN ('NARRATIVA', 'MERMA_PROMEDIO', 'DEVOLUCIONES_PROMEDIO')
      ORDER BY categoria, anio
    `);
    
    return {
      mermaAnual,
      devoluciones,
      narrativas
    };
  }
}

module.exports = DashboardRepository;
