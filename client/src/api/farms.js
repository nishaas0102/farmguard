import api from './axios';

export const farmsAPI = {
  getAll: () => api.get('/farms'),
  getOne: (id) => api.get(`/farms/${id}`),
  create: (data) => api.post('/farms', data),
  update: (id, data) => api.put(`/farms/${id}`, data),
  delete: (id) => api.delete(`/farms/${id}`),
};
