import api from '../config/api';

export const financialService = {
  async getAllData() {
    const response = await api.get('/financial/all');
    return response.data;
  },

  async getSummary() {
    const response = await api.get('/financial/summary');
    return response.data;
  },

  async getByCategory(category) {
    const response = await api.get(`/financial/category/${category}`);
    return response.data;
  }
};
