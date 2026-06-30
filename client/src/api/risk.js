import api from './axios';

export const riskAPI = {
  getSummary: () => api.get('/risk/summary'),
  getList: () => api.get('/risk/list'),
};
