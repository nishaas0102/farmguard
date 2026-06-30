import api from './axios';

export const drugsAPI = {
  getAll: (params) => api.get('/drugs', { params }),
  getOne: (id) => api.get(`/drugs/${id}`),
  checkInteractions: (drugNames) => api.post('/drugs/check-interactions', { drugNames }),
  checkNewDrug: (existingDrugs, newDrug) => api.post('/drugs/check-new', { existingDrugs, newDrug }),
};
