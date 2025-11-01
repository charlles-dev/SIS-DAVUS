import api from '../lib/api';

export const movementService = {
  async getAll(params = {}) {
    const response = await api.get('/movements', { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/movements', data);
    return response.data;
  },

  async getStats(params = {}) {
    const response = await api.get('/movements/stats', { params });
    return response.data;
  },
};
