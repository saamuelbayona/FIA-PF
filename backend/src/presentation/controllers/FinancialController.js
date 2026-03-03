/**
 * Controlador de Datos Financieros
 * Presentation Layer
 */

class FinancialController {
  constructor(getAllFinancialDataUseCase, getSummaryUseCase) {
    this.getAllFinancialDataUseCase = getAllFinancialDataUseCase;
    this.getSummaryUseCase = getSummaryUseCase;
  }

  /**
   * Obtener todos los datos financieros
   */
  async getAll(req, res, next) {
    try {
      const data = await this.getAllFinancialDataUseCase.execute();
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener resumen por categoría
   */
  async getSummary(req, res, next) {
    try {
      const summary = await this.getSummaryUseCase.execute();
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener datos por categoría
   */
  async getByCategory(req, res, next) {
    try {
      const { category } = req.params;
      
      // Validar categoría
      const validCategories = ['ACTIVOS', 'PASIVOS', 'PATRIMONIO'];
      if (!validCategories.includes(category.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: 'Categoría inválida'
        });
      }

      const data = await this.getAllFinancialDataUseCase.execute();
      const categoryData = data[category.toLowerCase()];

      res.json({
        success: true,
        data: categoryData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FinancialController;
