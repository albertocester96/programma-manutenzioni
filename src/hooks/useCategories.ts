// src/hooks/useCategories.ts
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
}

export function useCategories(type: 'equipment_category' | 'equipment_location') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories?type=${type}`);
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle categorie');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Errore nel caricamento delle categorie:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}