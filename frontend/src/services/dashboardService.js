import { API_BASE_URL } from '../config/api';

/**
 * Servicio para gestionar dashboards
 */
export const dashboardService = {
  /**
   * Obtiene el resumen de todos los dashboards disponibles
   */
  async getDashboardsSummary() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener resumen de dashboards');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en getDashboardsSummary:', error);
      throw error;
    }
  },

  /**
   * Obtiene datos de un dashboard específico
   * @param {string} type - Tipo de dashboard (auditoria, cartera, humana, etc.)
   */
  async getDashboardData(type) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos del dashboard ${type}`);
      }

      const result = await response.json();
      // El backend retorna { success: true, data: [...], type: '...' }
      // Extraemos solo el array de datos
      return result.data || result;
    } catch (error) {
      console.error(`Error en getDashboardData(${type}):`, error);
      throw error;
    }
  },

  /**
   * Carga los archivos CSV a la base de datos
   */
  async loadCSVData() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/load-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos CSV');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en loadCSVData:', error);
      throw error;
    }
  }
};
