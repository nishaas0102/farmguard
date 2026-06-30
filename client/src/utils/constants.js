export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ROLES = {
  FARMER: 'farmer',
  VET: 'vet',
  ADMIN: 'admin',
};

export const RISK_LEVELS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

export const SPECIES = ['cattle', 'buffalo', 'goat', 'sheep', 'swine', 'poultry', 'fish'];

export const WHO_CATEGORIES = ['Access', 'Watch', 'Reserve', 'AWaRe', 'Not Listed'];

export const ALERT_TYPES = ['mrl_violation', 'overdose', 'critical_antibiotic', 'risk_escalation', 'withdrawal_breach'];

export const ALERT_SEVERITIES = ['low', 'medium', 'high', 'critical'];
