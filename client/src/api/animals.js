import api from './axios';

export const animalsAPI = {
  getAll: (farmId) => api.get('/animals', { params: farmId ? { farm_id: farmId } : {} }),
  getOne: (id) => api.get(`/animals/${id}`),
  create: (data) => api.post('/animals', data),
  update: (id, data) => api.put(`/animals/${id}`, data),
  delete: (id) => api.delete(`/animals/${id}`),
};
