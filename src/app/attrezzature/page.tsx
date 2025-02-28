// src/app/attrezzature/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Equipment } from '@/models/equipment';
import EquipmentList from '@/components/equipment/EquipmentList';
import Link from 'next/link';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    loadEquipments();
  }, []);
  
  const loadEquipments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle attrezzature');
      }
      const data = await response.json();
      setEquipments(data);
    } catch (error) {
      console.error('Errore nel caricamento delle attrezzature:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa attrezzatura?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione dell\'attrezzatura');
      }
      
      // Aggiorna la lista delle attrezzature
      setEquipments(equipments.filter(eq => eq.id !== id));
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'attrezzatura:', error);
      alert('Si è verificato un errore durante l\'eliminazione dell\'attrezzatura');
    }
  };
  
  // Filtra le attrezzature in base al termine di ricerca
  const filteredEquipments = equipments.filter(equipment => 
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attrezzature</h1>
        <Link 
          href="/attrezzature/nuova" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          Nuova Attrezzatura
        </Link>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cerca attrezzature..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {searchTerm 
              ? 'Nessun risultato trovato per la ricerca.' 
              : 'Nessuna attrezzatura presente.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <EquipmentList equipments={filteredEquipments} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

