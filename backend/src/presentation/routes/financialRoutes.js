/**
 * Rutas de Datos Financieros
 * Presentation Layer
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

module.exports = (financialController) => {
  /**
   * GET /api/financial/all
   * Obtener todos los datos financieros
   */
  router.get('/all', verifyToken, (req, res, next) => 
    financialController.getAll(req, res, next)
  );

  /**
   * GET /api/financial/summary
   * Obtener resumen por categoría
   */
  router.get('/summary', verifyToken, (req, res, next) => 
    financialController.getSummary(req, res, next)
  );

  /**
   * GET /api/financial/category/:category
   * Obtener datos por categoría
   */
  router.get('/category/:category', verifyToken, (req, res, next) => 
    financialController.getByCategory(req, res, next)
  );

  return router;
};
