/**
 * Índice de Rutas
 * Presentation Layer
 */

const authRoutes = require('./authRoutes');
const financialRoutes = require('./financialRoutes');

module.exports = (authController, financialController) => {
  return {
    auth: authRoutes(authController),
    financial: financialRoutes(financialController)
  };
};
