import { useState, useEffect, useCallback } from 'react';
import { animalsAPI } from '../api/animals';

export function useAnimals(farmId) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await animalsAPI.getAll(farmId);
      setAnimals(data);
    } catch { setAnimals([]); }
    finally { setLoading(false); }
  }, [farmId]);

  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  return { animals, loading, refetch: fetchAnimals };
}

export function useAnimal(id) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    animalsAPI.getOne(id)
      .then(({ data }) => setAnimal(data))
      .catch(() => setAnimal(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { animal, loading };
}
