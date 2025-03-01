
'use client';

import { useState, useEffect } from 'react';
import { Maintenance } from '@/models/maintenances';
import MaintenanceCard from '@/components/maintenance/MaintenanceCard';
import Link from 'next/link';

export default function DashboardPage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'oggi' | 'domani' | 'settimana'>('oggi');
  
  useEffect(() => {
    loadMaintenances();
  }, [filter]);
  
  const loadMaintenances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/maintenances?filter=${filter}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle manutenzioni');
      }
      const data = await response.json();
      setMaintenances(data);
    } catch (error) {
      console.error('Errore nel caricamento delle manutenzioni:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/maintenances/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Errore durante il completamento della manutenzione');
      }
      
      // Aggiorna lo stato locale
      setMaintenances(maintenances.map(m => 
        m.id === id ? { ...m, status: 'completata', completedDate: new Date().toISOString() } : m
      ));
    } catch (error) {
      console.error('Errore durante il completamento della manutenzione:', error);
    }
  };
  
  const handleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/maintenances/${id}/archive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'archiviazione della manutenzione');
      }
      
      // Rimuovi dalla lista corrente
      setMaintenances(maintenances.filter(m => m.id !== id));
    } catch (error) {
      console.error('Errore durante l\'archiviazione della manutenzione:', error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Manutenzioni</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setFilter('oggi')}
              className={`py-2 px-4 text-sm font-medium rounded-l-lg ${
                filter === 'oggi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Oggi
            </button>
            <button
              type="button"
              onClick={() => setFilter('domani')}
              className={`py-2 px-4 text-sm font-medium ${
                filter === 'domani'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-200`}
            >
              Domani
            </button>
            <button
              type="button"
              onClick={() => setFilter('settimana')}
              className={`py-2 px-4 text-sm font-medium rounded-r-lg ${
                filter === 'settimana'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-200`}
            >
              Settimana
            </button>
          </div>
          
          <Link href="/manutenzioni/nuova" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors">
            Nuova Manutenzione
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : maintenances.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Nessuna manutenzione {filter === 'oggi' ? 'per oggi' : filter === 'domani' ? 'per domani' : 'questa settimana'}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maintenances.map((maintenance) => (
            <MaintenanceCard
              key={maintenance.id}
              maintenance={maintenance}
              onComplete={handleComplete}
              onArchive={maintenance.status === 'completata' ? handleArchive : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}