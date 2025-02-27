'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Equipment } from '@/models/equipment';

export default function EquipmentDetailPage() {
  const params = useParams();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`/api/equipment/${id}`);
        
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei dettagli dell\'attrezzatura');
        }
        
        const data = await response.json();
        setEquipment(data);
      } catch (err) {
        console.error('Errore:', err);
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEquipment();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center text-gray-500 py-6">
        Nessuna attrezzatura trovata
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{equipment.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Dettagli Attrezzatura</h2>
            <p><strong>Numero di Serie:</strong> {equipment.serialNumber}</p>
            <p><strong>Categoria:</strong> {equipment.category}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Informazioni Aggiuntive</h2>
            <p><strong>Stato:</strong> {equipment.status}</p>
            <p><strong>Ultima Manutenzione:</strong> {equipment.lastMaintenance ? new Date(equipment.lastMaintenance).toLocaleDateString() : 'Mai'}</p>
          </div>
        </div>
        
        {equipment.notes && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Note</h2>
            <p className="text-gray-600">{equipment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}