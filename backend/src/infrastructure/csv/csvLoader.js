const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { getInstance } = require('../database/connection');

class CSVLoader {
  constructor() {
    this.csvDirectory = path.join(__dirname, '../../../../csv');
  }

  /**
   * Carga todos los archivos CSV a la base de datos
   */
  async loadAllCSVs() {
    try {
      console.log('Iniciando carga de archivos CSV...');
      
      await this.loadFuentesUsosCSV();
      await this.loadAuditoriaCSV();
      await this.loadGestionCarteraCSV();
      await this.loadGestionHumanaCSV();
      await this.loadGestionHumanaCostosCSV();
      await this.loadGestionHumanaRetirosCSV();
      await this.loadGestionLogisticaCSV();
      await this.loadProduccionCSV();
      await this.loadEquipoVentasCSV();
      await this.loadGestionComercialCSV();
      await this.loadSagrilaftCSV();
      await this.loadGestionGerenciaCSV();
      
      console.log('✓ Todos los archivos CSV han sido cargados exitosamente');
      return { success: true, message: 'Datos cargados correctamente' };
    } catch (error) {
      console.error('Error al cargar CSVs:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Fuentes y Usos (Balance General)
   */
  async loadFuentesUsosCSV() {
    const filePath = path.join(this.csvDirectory, 'fia.csv');
    console.log('Cargando fia.csv (Fuentes y Usos)...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM fuentes_usos');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      const cleanNumber = (str) => {
        if (!str || str.trim() === '') return null;
        const cleaned = str.replace(/[;$,]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      };
      
      let currentType = '';
      
      for (let i = 6; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(';');
        const categoria = values[0]?.trim();
        
        if (!categoria) continue;
        
        // Detectar tipo de sección
        if (categoria.includes('A C T I V O')) {
          currentType = 'ACTIVO';
          continue;
        } else if (categoria.includes('P A S I V O')) {
          currentType = 'PASIVO';
          continue;
        } else if (categoria.includes('P A T R I M O N I O')) {
          currentType = 'PATRIMONIO';
          continue;
        }
        
        // Saltar líneas de totales y vacías
        if (categoria.includes('TOTAL') || categoria.includes('T O T A L')) continue;
        
        const valor2025 = cleanNumber(values[1]);
        const valor2024 = cleanNumber(values[2]);
        const variacion = cleanNumber(values[3]);
        const fuentes = cleanNumber(values[4]);
        const usos = cleanNumber(values[5]);
        
        if (valor2025 !== null || valor2024 !== null) {
          await pool.query(
            `INSERT INTO fuentes_usos 
            (anio, categoria, tipo, valor_actual, valor_anterior, variacion, fuentes, usos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [2025, categoria, currentType, valor2025, valor2024, variacion, fuentes, usos]
          );
        }
      }
      
      console.log('✓ fia.csv (Fuentes y Usos) cargado');
    } catch (error) {
      console.error('Error en loadFuentesUsosCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Auditoría (Análisis de Merma)
   */
  async loadAuditoriaCSV() {
    const filePath = path.join(this.csvDirectory, 'AUDITORIA.csv');
    console.log('Cargando AUDITORIA.csv...');
    
    // Implementación específica para el formato de AUDITORIA.csv
    // Este archivo tiene un formato especial que requiere parsing manual
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      // Limpiar tabla
      await pool.query('DELETE FROM auditoria_merma');
      
      // Procesar datos de merma por año (líneas 4-7)
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      for (let i = 4; i <= 7; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(',');
        const anio = parseInt(values[0]);
        
        if (isNaN(anio)) continue;
        
        for (let j = 1; j <= 12; j++) {
          const valor = values[j];
          if (valor && valor.trim() !== '') {
            const porcentaje = parseFloat(valor.replace('%', ''));
            if (!isNaN(porcentaje)) {
              await pool.query(
                'INSERT INTO auditoria_merma (anio, mes, mes_numero, porcentaje_merma) VALUES (?, ?, ?, ?)',
                [anio, meses[j-1], j, porcentaje]
              );
            }
          }
        }
      }
      
      console.log('✓ AUDITORIA.csv cargado');
    } catch (error) {
      console.error('Error en loadAuditoriaCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión de Cartera
   */
  async loadGestionCarteraCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTION CARTERA.csv');
    console.log('Cargando GESTION CARTERA.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_cartera');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      // Procesar desde la línea 2 (después del header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.split(',').length < 10) continue;
        
        const values = line.split(',');
        const mes = values[0];
        
        if (!mes || mes === '' || mes === 'MES') continue;
        
        // Extraer año del formato "Jan-25"
        const [mesAbrev, anioCorto] = mes.split('-');
        if (!anioCorto) continue;
        
        const anio = 2000 + parseInt(anioCorto);
        
        const cleanNumber = (str) => {
          if (!str) return null;
          return parseFloat(str.replace(/[$,"%]/g, '').replace(/[()]/g, '-'));
        };
        
        await pool.query(
          `INSERT INTO gestion_cartera 
          (mes, anio, total_cartera, cartera_vencida, indice_morosidad, 
           variacion_cartera_vencida, dias_rotacion, porcentaje_ventas_contado,
           ventas_contado, porcentaje_ventas_credito, ventas_credito, ventas_netas_empresa)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mes, anio,
            cleanNumber(values[1]),
            cleanNumber(values[2]),
            cleanNumber(values[3]),
            cleanNumber(values[4]),
            cleanNumber(values[5]),
            cleanNumber(values[6]),
            cleanNumber(values[7]),
            cleanNumber(values[8]),
            cleanNumber(values[9]),
            cleanNumber(values[10])
          ]
        );
      }
      
      console.log('✓ GESTION CARTERA.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionCarteraCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Humana
   */
  async loadGestionHumanaCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN HUMANA.csv');
    console.log('Cargando GESTIÓN HUMANA.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_humana_personal');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      if (lines.length > 1) {
        const values = lines[1].split(',');
        const mes = values[0];
        
        if (mes && mes.trim() !== '') {
          // Datos 2024
          await pool.query(
            `INSERT INTO gestion_humana_personal 
            (anio, mes, numero_personas, variacion_porcentaje, variacion_personas)
            VALUES (?, ?, ?, ?, ?)`,
            [
              2024,
              mes.trim(),
              parseInt(values[1]) || null,
              parseFloat(values[3]?.replace('%', '')) || null,
              parseInt(values[4]) || null
            ]
          );
          
          // Datos 2025
          await pool.query(
            `INSERT INTO gestion_humana_personal 
            (anio, mes, numero_personas, variacion_porcentaje, variacion_personas)
            VALUES (?, ?, ?, ?, ?)`,
            [
              2025,
              mes.trim(),
              parseInt(values[2]) || null,
              parseFloat(values[3]?.replace('%', '')) || null,
              parseInt(values[4]) || null
            ]
          );
        }
      }
      
      console.log('✓ GESTIÓN HUMANA.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionHumanaCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Logística
   */
  async loadGestionLogisticaCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN LOGISTICA 2025.csv');
    console.log('Cargando GESTIÓN LOGISTICA 2025.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_logistica');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      const sedes = ['SEDE 1', 'SEDE 2', 'SEDE 3'];
      const startLines = [5, 16, 27]; // Líneas donde empiezan los datos de cada sede
      
      for (let s = 0; s < sedes.length; s++) {
        const sede = sedes[s];
        const startLine = startLines[s];
        
        for (let i = startLine; i < startLine + 7; i++) {
          if (i >= lines.length) break;
          
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const concepto = values[0];
          
          if (!concepto || concepto === 'CONCEPTO') continue;
          
          const cleanNumber = (str) => {
            if (!str || str.trim() === '') return null;
            const cleaned = str.replace(/[$,%]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? null : num;
          };
          
          const total2024 = cleanNumber(values[1]);
          const total2025 = cleanNumber(values[2]);
          const variacion = cleanNumber(values[3]);
          
          // Solo insertar si al menos uno de los valores no es null
          if (total2024 !== null || total2025 !== null || variacion !== null) {
            await pool.query(
              `INSERT INTO gestion_logistica 
              (sede, anio, concepto, total_2024, total_2025, variacion_porcentaje)
              VALUES (?, ?, ?, ?, ?, ?)`,
              [sede, 2025, concepto, total2024, total2025, variacion]
            );
          }
        }
      }
      
      console.log('✓ GESTIÓN LOGISTICA 2025.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionLogisticaCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión de Producción
   */
  async loadProduccionCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN PRODUCCIÓN AÑO 2025 .csv');
    console.log('Cargando GESTIÓN PRODUCCIÓN AÑO 2025.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM produccion_encasetado');
      await pool.query('DELETE FROM produccion_granjas');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
      
      for (let i = 3; i <= 14; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(',');
        const mes = values[0];
        const mesIndex = meses.indexOf(mes);
        
        if (mesIndex === -1) continue;
        
        const cleanNumber = (str) => {
          if (!str) return null;
          return parseInt(str.replace(/[,"]/g, ''));
        };
        
        // Datos 2024
        await pool.query(
          `INSERT INTO produccion_encasetado (anio, mes, mes_numero, programado, real_value)
          VALUES (?, ?, ?, ?, ?)`,
          [2024, mes, mesIndex + 1, cleanNumber(values[1]), cleanNumber(values[2])]
        );
        
        // Datos 2025
        await pool.query(
          `INSERT INTO produccion_encasetado (anio, mes, mes_numero, programado, real_value)
          VALUES (?, ?, ?, ?, ?)`,
          [2025, mes, mesIndex + 1, cleanNumber(values[3]), cleanNumber(values[4])]
        );
      }
      
      // Procesar granjas FRIO
      for (let i = 4; i <= 22; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(',');
        const tipo = values[17];
        const granja = values[18];
        const metros = values[19];
        const aves = values[20];
        
        if (!tipo || !granja || tipo === 'TIPO' || granja === 'TOTAL') continue;
        
        await pool.query(
          `INSERT INTO produccion_granjas (tipo, granja, metros, aves)
          VALUES (?, ?, ?, ?)`,
          [tipo, granja, parseInt(metros) || null, parseInt(aves) || null]
        );
      }
      
      // Procesar granjas CALIENTE
      for (let i = 24; i <= 28; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(',');
        const tipo = values[17];
        const granja = values[18];
        const metros = values[19];
        const aves = values[20];
        
        if (!tipo || !granja || tipo === 'TIPO' || granja === 'TOTAL') continue;
        
        await pool.query(
          `INSERT INTO produccion_granjas (tipo, granja, metros, aves)
          VALUES (?, ?, ?, ?)`,
          [tipo, granja, parseInt(metros) || null, parseInt(aves) || null]
        );
      }
      
      // Procesar granjas CALIDO
      for (let i = 31; i <= 43; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const values = line.split(',');
        const tipo = values[17];
        const granja = values[18];
        const metros = values[19];
        const aves = values[20];
        
        if (!tipo || !granja || tipo === 'TIPO' || granja === 'TOTAL') continue;
        
        await pool.query(
          `INSERT INTO produccion_granjas (tipo, granja, metros, aves)
          VALUES (?, ?, ?, ?)`,
          [tipo, granja, parseInt(metros) || null, parseInt(aves) || null]
        );
      }
      
      console.log('✓ GESTIÓN PRODUCCIÓN AÑO 2025.csv cargado (incluye granjas)');
    } catch (error) {
      console.error('Error en loadProduccionCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Equipo de Ventas
   */
  async loadEquipoVentasCSV() {
    const filePath = path.join(this.csvDirectory, 'Equipo de Ventas Institucional.csv');
    console.log('Cargando Equipo de Ventas Institucional.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM equipo_ventas');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      for (let i = 6; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === 'Total general') continue;
        
        const values = line.split(',');
        const temperatura = values[0];
        
        if (!temperatura || temperatura === 'Temperatura') continue;
        
        const cleanNumber = (str) => {
          if (!str || str.trim() === '') return null;
          const cleaned = str.replace(/[,%]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? null : num;
        };
        
        await pool.query(
          `INSERT INTO equipo_ventas 
          (sede, vendedor, anio, ventas_kg, meta, cumplimiento)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            'SEDE 3',
            temperatura,
            2025,
            cleanNumber(values[1]),
            cleanNumber(values[3]),
            cleanNumber(values[5])
          ]
        );
      }
      
      console.log('✓ Equipo de Ventas Institucional.csv cargado');
    } catch (error) {
      console.error('Error en loadEquipoVentasCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Comercial
   */
  async loadGestionComercialCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN COMERCIAL SEDE 1 CANAL .csv');
    console.log('Cargando GESTIÓN COMERCIAL SEDE 1 CANAL.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_comercial_ventas');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === 'Total general') continue;
        
        const values = line.split(',');
        const descripcion = values[0];
        
        if (!descripcion || descripcion === 'DESCRIPCION') continue;
        
        const cleanNumber = (str) => {
          if (!str || str.trim() === '') return null;
          const cleaned = str.replace(/[,%]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? null : num;
        };
        
        await pool.query(
          `INSERT INTO gestion_comercial_ventas 
          (sede, canal, anio, concepto, valor_kg, porcentaje_participacion, variacion)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            'SEDE 1',
            'ASADERO',
            2025,
            descripcion,
            cleanNumber(values[1]),
            cleanNumber(values[2]),
            cleanNumber(values[5])
          ]
        );
      }
      
      console.log('✓ GESTIÓN COMERCIAL SEDE 1 CANAL.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionComercialCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Sistema SAGRILAFT
   */
  async loadSagrilaftCSV() {
    const filePath = path.join(this.csvDirectory, 'SISTEMA SAGRILAFT 2025 - 2026.csv');
    console.log('Cargando SISTEMA SAGRILAFT 2025 - 2026.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM sistema_sagrilaft');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      // Primera línea tiene el total de stakeholders
      const totalLine = lines[0].split(',');
      const totalStakeholders = parseInt(totalLine[1]?.replace(/[^\d]/g, '')) || 5732;
      
      // Procesar datos de contrapartes (líneas 5-9)
      for (let i = 5; i <= 9; i++) {
        if (i >= lines.length) break;
        
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const contraparte = values[0];
        
        if (!contraparte || contraparte === 'CONTRAPARTE' || contraparte === 'TOTAL NO CONFORMES') continue;
        
        const cleanNumber = (str) => {
          if (!str || str.trim() === '') return null;
          const cleaned = str.replace(/[,%]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? null : num;
        };
        
        await pool.query(
          `INSERT INTO sistema_sagrilaft 
          (anio, contraparte, stakeholders_validados, stakeholders_rechazados, 
           porcentaje_la, porcentaje_ft, porcentaje_documentacion, porcentaje_antecedentes, porcentaje_peps)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            2025,
            contraparte,
            totalStakeholders,
            parseInt(values[1]) || null,
            cleanNumber(values[2]),
            cleanNumber(values[3]),
            cleanNumber(values[4]),
            cleanNumber(values[5]),
            cleanNumber(values[6])
          ]
        );
      }
      
      console.log('✓ SISTEMA SAGRILAFT 2025 - 2026.csv cargado');
    } catch (error) {
      console.error('Error en loadSagrilaftCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Humana - Costos
   */
  async loadGestionHumanaCostosCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN HUMANA - COSTO.csv');
    console.log('Cargando GESTIÓN HUMANA - COSTO.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_humana_costos');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      if (lines.length > 2) {
        const values = lines[2].split(',');
        
        const cleanNumber = (str) => {
          if (!str || str.trim() === '') return null;
          const cleaned = str.replace(/[$,"%]/g, '').trim();
          const num = parseFloat(cleaned);
          return isNaN(num) ? null : num;
        };
        
        // Insertar valor 2024
        await pool.query(
          `INSERT INTO gestion_humana_costos (anio, concepto, valor, variacion_porcentaje)
          VALUES (?, ?, ?, ?)`,
          [2024, 'Costo de nómina', cleanNumber(values[1]), null]
        );
        
        // Insertar valor 2025
        await pool.query(
          `INSERT INTO gestion_humana_costos (anio, concepto, valor, variacion_porcentaje)
          VALUES (?, ?, ?, ?)`,
          [2025, 'Costo de nómina', cleanNumber(values[2]), cleanNumber(values[3])]
        );
      }
      
      console.log('✓ GESTIÓN HUMANA - COSTO.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionHumanaCostosCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Humana - Retiros
   */
  async loadGestionHumanaRetirosCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN HUMANA - RETIROS.csv');
    console.log('Cargando GESTIÓN HUMANA - RETIROS.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_humana_retiros');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      let totalRetiros = 0;
      const retiros = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('Total general')) continue;
        
        const values = line.split(',');
        const motivo = values[0];
        const cantidad = parseInt(values[1]);
        
        if (motivo && !isNaN(cantidad) && motivo !== 'MOTIVO DE RETIRO') {
          totalRetiros += cantidad;
          retiros.push({ motivo, cantidad });
        }
      }
      
      for (const retiro of retiros) {
        const porcentaje = totalRetiros > 0 ? (retiro.cantidad / totalRetiros) * 100 : 0;
        
        await pool.query(
          `INSERT INTO gestion_humana_retiros (anio, motivo, cantidad, porcentaje)
          VALUES (?, ?, ?, ?)`,
          [2025, retiro.motivo, retiro.cantidad, porcentaje]
        );
      }
      
      console.log('✓ GESTIÓN HUMANA - RETIROS.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionHumanaRetirosCSV:', error);
      throw error;
    }
  }

  /**
   * Carga datos de Gestión Gerencia Estratégica
   */
  async loadGestionGerenciaCSV() {
    const filePath = path.join(this.csvDirectory, 'GESTIÓN GERENCIA ESTRATÉGICA Y .csv');
    console.log('Cargando GESTIÓN GERENCIA ESTRATÉGICA Y.csv...');
    
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      await pool.query('DELETE FROM gestion_gerencia');
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      let currentArea = 'General';
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const campo = values[0]?.trim();
        
        if (!campo) continue;
        
        if (campo.includes('SST') || campo.includes('AMBIENTAL') || 
            campo.includes('CALIDAD') || campo.includes('COMPRAS') ||
            campo.includes('BIENESTAR')) {
          currentArea = campo;
          continue;
        }
        
        const indicador = campo;
        const valor = values[1]?.trim() || '';
        
        await pool.query(
          `INSERT INTO gestion_gerencia (anio, area, indicador, valor)
          VALUES (?, ?, ?, ?)`,
          [2025, currentArea, indicador, valor]
        );
      }
      
      console.log('✓ GESTIÓN GERENCIA ESTRATÉGICA Y.csv cargado');
    } catch (error) {
      console.error('Error en loadGestionGerenciaCSV:', error);
      throw error;
    }
  }
}

module.exports = new CSVLoader();
