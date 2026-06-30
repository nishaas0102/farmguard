import { useState, useEffect, useCallback } from 'react';
import { alertsAPI } from '../api/alerts';

export function useAlertsList(params) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await alertsAPI.getAll(params);
      setAlerts(data);
    } catch { setAlerts([]); }
    finally { setLoading(false); }
  }, [params]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  return { alerts, loading, refetch: fetchAlerts };
}
