/**
 * Entidad Datos Financieros
 * Domain Layer
 */

class FinancialData {
  constructor({
    id,
    category,
    subcategory,
    account_name,
    value_2025,
    value_2024,
    variation,
    fuentes,
    usos,
    created_at
  }) {
    this.id = id;
    this.category = category;
    this.subcategory = subcategory;
    this.accountName = account_name;
    this.value2025 = parseFloat(value_2025) || 0;
    this.value2024 = parseFloat(value_2024) || 0;
    this.variation = parseFloat(variation) || 0;
    this.fuentes = parseFloat(fuentes) || 0;
    this.usos = parseFloat(usos) || 0;
    this.createdAt = created_at;
  }

  /**
   * Calcular porcentaje de variación
   */
  getVariationPercentage() {
    if (this.value2024 === 0) return 0;
    return ((this.variation / this.value2024) * 100).toFixed(2);
  }

  /**
   * Verificar si es un total
   */
  isTotal() {
    return this.subcategory === 'TOTAL' || this.category === 'TOTAL';
  }

  /**
   * Convertir a objeto simple
   */
  toJSON() {
    return {
      id: this.id,
      category: this.category,
      subcategory: this.subcategory,
      accountName: this.accountName,
      value2025: this.value2025,
      value2024: this.value2024,
      variation: this.variation,
      variationPercentage: this.getVariationPercentage(),
      fuentes: this.fuentes,
      usos: this.usos,
      createdAt: this.createdAt
    };
  }
}

module.exports = FinancialData;
