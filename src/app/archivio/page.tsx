// src/app/archivio/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Maintenance } from '@/models/maintenances';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function ArchivePage() {
  const [archivedMaintenances, setArchivedMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    loadArchivedMaintenances();
  }, []);
  
  const loadArchivedMaintenances = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/maintenances?status=archiviata');
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle manutenzioni archiviate');
      }
      const data = await response.json();
      setArchivedMaintenances(data);
    } catch (error) {
      console.error('Errore nel caricamento delle manutenzioni archiviate:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtra le manutenzioni in base al termine di ricerca
  const filteredMaintenances = archivedMaintenances.filter(maintenance => 
    maintenance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    maintenance.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Archivio Manutenzioni</h1>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cerca manutenzioni archiviate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMaintenances.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {searchTerm 
              ? 'Nessun risultato trovato per la ricerca.' 
              : 'Nessuna manutenzione archiviata.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titolo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attrezzatura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Pianificata
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Completamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorità
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dettagli
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenances.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{maintenance.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{maintenance.equipmentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(maintenance.scheduledDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {maintenance.completedDate ? formatDate(maintenance.completedDate) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      maintenance.priority === 'alta' 
                        ? 'bg-red-100 text-red-800' 
                        : maintenance.priority === 'media'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {maintenance.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/manutenzioni/${maintenance.id}`} className="text-blue-600 hover:text-blue-900">
                      Dettagli
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}