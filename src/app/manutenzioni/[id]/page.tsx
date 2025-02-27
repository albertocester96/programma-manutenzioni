// src/app/manutenzioni/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Maintenance } from '@/models/maintenances';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default function MaintenanceDetailsPage({ params }: Props) {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadMaintenance();
  }, []);
  
  const loadMaintenance = async () => {
    try {
      const response = await fetch(`/api/maintenances/${params.id}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento della manutenzione');
      }
      const data = await response.json();
      setMaintenance(data);
    } catch (error) {
      console.error('Errore nel caricamento della manutenzione:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!maintenance) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-red-500">
            Manutenzione non trovata.
          </p>
          <div className="mt-6 flex justify-end">
            <Link href="/manutenzioni" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Torna alla lista
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dettagli Manutenzione</h1>
        <div className="flex space-x-2">
          <Link 
            href={`/manutenzioni/modifica/${params.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Modifica
          </Link>
          <Link 
            href="/manutenzioni" 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
          >
            Torna alla lista
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Titolo</p>
            <p className="mt-1 text-lg text-gray-900">{maintenance.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Attrezzatura</p>
            <p className="mt-1 text-lg text-gray-900">{maintenance.equipmentName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Descrizione</p>
            <p className="mt-1 text-lg text-gray-900">{maintenance.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Data Pianificata</p>
            <p className="mt-1 text-lg text-gray-900">{new Date(maintenance.scheduledDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Priorità</p>
            <p className="mt-1 text-lg text-gray-900 capitalize">{maintenance.priority}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Assegnato a</p>
            <p className="mt-1 text-lg text-gray-900">{maintenance.assignedTo || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Stato</p>
            <p className="mt-1 text-lg text-gray-900 capitalize">{maintenance.status}</p>
          </div>
          {maintenance.completedDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">Data Completamento</p>
              <p className="mt-1 text-lg text-gray-900">{new Date(maintenance.completedDate).toLocaleDateString()}</p>
            </div>
          )}
          {maintenance.notes && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Note</p>
              <p className="mt-1 text-lg text-gray-900">{maintenance.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}