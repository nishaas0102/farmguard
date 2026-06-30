import api from './axios';

export const amuAPI = {
  getAll: (params) => api.get('/amu', { params }),
  getOne: (id) => api.get(`/amu/${id}`),
  create: (data) => api.post('/amu', data),
  update: (id, data) => api.put(`/amu/${id}`, data),
  delete: (id) => api.delete(`/amu/${id}`),
};
