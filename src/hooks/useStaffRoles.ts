// src/hooks/useStaffRoles.ts
import { useState, useEffect } from 'react';

interface StaffRole {
  id: string;
  name: string;
}

export function useStaffRoles() {
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaffRoles();
  }, []);

  const fetchStaffRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?type=staff_role');
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei ruoli');
      }
      
      const data = await response.json();
      setStaffRoles(data);
    } catch (err) {
      console.error('Errore nel caricamento dei ruoli:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return { staffRoles, loading, error, refetch: fetchStaffRoles };
}