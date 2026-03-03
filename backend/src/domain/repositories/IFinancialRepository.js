/**
 * Interface del Repositorio de Datos Financieros
 * Domain Layer
 */

class IFinancialRepository {
  async findAll() {
    throw new Error('Method not implemented');
  }

  async findByCategory(category) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async getSummaryByCategory() {
    throw new Error('Method not implemented');
  }

  async create(financialData) {
    throw new Error('Method not implemented');
  }

  async update(id, financialData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IFinancialRepository;
