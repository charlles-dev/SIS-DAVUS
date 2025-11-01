import api from '../lib/api';

export const dashboardService = {
  async getOverview() {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
};
