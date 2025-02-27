// src/app/manutenzioni/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Maintenance } from '@/models/maintenances';
import Link from 'next/link';
import MaintenanceCard from '@/components/maintenance/MaintenanceCard';
import { groupMaintenancesByDate } from '@/lib/utils';

export default function MaintenancesPage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('');
  
  useEffect(() => {
    loadMaintenances();
  }, [status]);
  
  const loadMaintenances = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    console.log('Fetching maintenances with params:', params.toString());
    
    const response = await fetch(`/api/maintenances?${params.toString()}`);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      // Prova a leggere il corpo dell'errore
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      
      throw new Error(`Errore nel caricamento delle manutenzioni (${response.status})`);
    }
    
    const data = await response.json();
    console.log('Received maintenances:', data);
    
    setMaintenances(data);
  } catch (error) {
    console.error('Errore nel caricamento delle manutenzioni:', error);
    // Potresti voler mostrare un messaggio di errore all'utente
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
      
      // Rimuovi dalla lista corrente se stiamo filtrando per stato
      if (status) {
        setMaintenances(maintenances.filter(m => m.id !== id));
      } else {
        // Altrimenti aggiorna lo stato
        setMaintenances(maintenances.map(m => 
          m.id === id ? { ...m, status: 'archiviata' } : m
        ));
      }
    } catch (error) {
      console.error('Errore durante l\'archiviazione della manutenzione:', error);
    }
  };
  
  // Raggruppa le manutenzioni per data
  const groupedMaintenances = groupMaintenancesByDate(maintenances);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tutte le Manutenzioni</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setStatus('')}
              className={`py-2 px-4 text-sm font-medium rounded-l-lg ${
                status === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200`}
            >
              Tutte
            </button>
            <button
              type="button"
              onClick={() => setStatus('pianificata')}
              className={`py-2 px-4 text-sm font-medium ${
                status === 'pianificata'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-200`}
            >
              Pianificate
            </button>
            <button
              type="button"
              onClick={() => setStatus('in corso')}
              className={`py-2 px-4 text-sm font-medium ${
                status === 'in corso'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-200`}
            >
              In Corso
            </button>
            <button
              type="button"
              onClick={() => setStatus('completata')}
              className={`py-2 px-4 text-sm font-medium rounded-r-lg ${
                status === 'completata'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-200`}
            >
              Completate
            </button>
          </div>
          
          <Link 
            href="/manutenzioni/nuova" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
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
          <p className="text-gray-500">
            Nessuna manutenzione {status ? `con stato "${status}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedMaintenances.map((group) => (
            <div key={group.date} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 bg-gray-100 p-2 rounded">
                {group.formattedDate}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((maintenance: Maintenance) => (
                  <MaintenanceCard
                    key={maintenance.id}
                    maintenance={maintenance}
                    onComplete={handleComplete}
                    onArchive={maintenance.status === 'completata' ? handleArchive : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}