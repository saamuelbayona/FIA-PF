/**
 * Caso de Uso: Obtener Todos los Datos Financieros
 * Application Layer
 */

class GetAllFinancialDataUseCase {
  constructor(financialRepository) {
    this.financialRepository = financialRepository;
  }

  /**
   * Ejecutar
   */
  async execute() {
    const allData = await this.financialRepository.findAll();
    
    // Agrupar por categoría
    const grouped = {
      activos: [],
      pasivos: [],
      patrimonio: [],
      totales: []
    };

    allData.forEach(item => {
      const data = item.toJSON();
      
      if (item.category === 'ACTIVOS') {
        grouped.activos.push(data);
      } else if (item.category === 'PASIVOS') {
        grouped.pasivos.push(data);
      } else if (item.category === 'PATRIMONIO') {
        grouped.patrimonio.push(data);
      } else if (item.category === 'TOTAL') {
        grouped.totales.push(data);
      }
    });

    return grouped;
  }
}

module.exports = GetAllFinancialDataUseCase;
