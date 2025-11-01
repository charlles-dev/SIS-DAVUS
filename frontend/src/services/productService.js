import api from '../lib/api';

export const productService = {
  async getAll(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/products/${id}`);
  },

  async getLowStock() {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/products/stats');
    return response.data;
  },
};
