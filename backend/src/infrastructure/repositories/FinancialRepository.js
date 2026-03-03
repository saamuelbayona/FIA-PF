/**
 * Implementación del Repositorio de Datos Financieros
 * Infrastructure Layer
 */

const IFinancialRepository = require('../../domain/repositories/IFinancialRepository');
const FinancialData = require('../../domain/entities/FinancialData');

class FinancialRepository extends IFinancialRepository {
  constructor(dbConnection) {
    super();
    this.db = dbConnection;
  }

  /**
   * Obtener todos los registros financieros
   */
  async findAll() {
    const sql = 'SELECT * FROM financial_data ORDER BY id';
    const results = await this.db.query(sql);
    return results.map(row => new FinancialData(row));
  }

  /**
   * Buscar por categoría
   */
  async findByCategory(category) {
    const sql = 'SELECT * FROM financial_data WHERE category = ? ORDER BY id';
    const results = await this.db.query(sql, [category]);
    return results.map(row => new FinancialData(row));
  }

  /**
   * Buscar por ID
   */
  async findById(id) {
    const sql = 'SELECT * FROM financial_data WHERE id = ?';
    const result = await this.db.queryOne(sql, [id]);
    return result ? new FinancialData(result) : null;
  }

  /**
   * Obtener resumen por categoría
   */
  async getSummaryByCategory() {
    const sql = `
      SELECT 
        category,
        COUNT(*) as total_items,
        SUM(value_2025) as total_2025,
        SUM(value_2024) as total_2024,
        SUM(variation) as total_variation
      FROM financial_data
      WHERE subcategory != 'TOTAL' AND category != 'TOTAL'
      GROUP BY category
    `;
    const results = await this.db.query(sql);
    return results;
  }

  /**
   * Crear nuevo registro
   */
  async create(financialData) {
    const sql = `
      INSERT INTO financial_data 
      (category, subcategory, account_name, value_2025, value_2024, variation, fuentes, usos) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await this.db.query(sql, [
      financialData.category,
      financialData.subcategory,
      financialData.accountName,
      financialData.value2025,
      financialData.value2024,
      financialData.variation,
      financialData.fuentes,
      financialData.usos
    ]);
    return result.insertId;
  }

  /**
   * Actualizar registro
   */
  async update(id, financialData) {
    const sql = `
      UPDATE financial_data 
      SET value_2025 = ?, value_2024 = ?, variation = ?, fuentes = ?, usos = ?
      WHERE id = ?
    `;
    await this.db.query(sql, [
      financialData.value2025,
      financialData.value2024,
      financialData.variation,
      financialData.fuentes,
      financialData.usos,
      id
    ]);
    return true;
  }

  /**
   * Eliminar registro
   */
  async delete(id) {
    const sql = 'DELETE FROM financial_data WHERE id = ?';
    await this.db.query(sql, [id]);
    return true;
  }
}

module.exports = FinancialRepository;
