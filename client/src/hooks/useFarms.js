import { useState, useEffect, useCallback } from 'react';
import { farmsAPI } from '../api/farms';

export function useFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await farmsAPI.getAll();
      setFarms(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch farms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFarms(); }, [fetchFarms]);

  return { farms, loading, error, refetch: fetchFarms };
}

export function useFarm(id) {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    farmsAPI.getOne(id)
      .then(({ data }) => setFarm(data))
      .catch(() => setFarm(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { farm, loading };
}
