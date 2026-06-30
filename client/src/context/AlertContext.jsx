import { createContext, useContext, useState, useCallback } from 'react';
import { alertsAPI } from '../api/alerts';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = useCallback(async (params) => {
    try {
      const { data } = await alertsAPI.getAll(params);
      setAlerts(data);
      setUnreadCount(data.filter(a => !a.is_read).length);
    } catch { /* ignore if not logged in */ }
  }, []);

  const markRead = async (id) => {
    await alertsAPI.markRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resolveAlert = async (id) => {
    await alertsAPI.resolve(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved_at: new Date().toISOString() } : a));
  };

  return (
    <AlertContext.Provider value={{ alerts, unreadCount, fetchAlerts, markRead, resolveAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertProvider');
  return ctx;
}
