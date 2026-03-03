/**
 * Caso de Uso: Obtener Resumen Financiero
 * Application Layer
 */

class GetSummaryUseCase {
  constructor(financialRepository) {
    this.financialRepository = financialRepository;
  }

  /**
   * Ejecutar
   */
  async execute() {
    const summary = await this.financialRepository.getSummaryByCategory();
    
    return summary.map(item => ({
      category: item.category,
      totalItems: item.total_items,
      total2025: parseFloat(item.total_2025),
      total2024: parseFloat(item.total_2024),
      totalVariation: parseFloat(item.total_variation),
      variationPercentage: item.total_2024 !== 0 
        ? ((parseFloat(item.total_variation) / parseFloat(item.total_2024)) * 100).toFixed(2)
        : 0
    }));
  }
}

module.exports = GetSummaryUseCase;
