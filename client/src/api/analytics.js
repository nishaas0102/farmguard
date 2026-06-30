import api from './axios';

export const analyticsAPI = {
  getSummary: (days) => api.get('/analytics/summary', { params: { days } }),
  getDrugUsage: (days) => api.get('/analytics/drug-usage', { params: { days } }),
  getAmuTrend: (days) => api.get('/analytics/amu-trend', { params: { days } }),
  getSpeciesBreakdown: (days) => api.get('/analytics/species-breakdown', { params: { days } }),
  getRiskHistory: (farmId) => api.get(`/analytics/risk-history/${farmId}`),
  getWhoCategories: (days) => api.get('/analytics/who-categories', { params: { days } }),
};
