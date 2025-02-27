// src/app/manutenzioni/modifica/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Equipment } from '@/models/equipment';
import { Maintenance } from '@/models/maintenances';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default function EditMaintenancePage({ params }: Props) {
  const router = useRouter();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    equipmentId: '',
    scheduledDate: '',
    priority: 'media' as 'bassa' | 'media' | 'alta',
    assignedTo: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    Promise.all([loadEquipments(), loadMaintenance()]);
  }, []);
  
  const loadEquipments = async () => {
    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle attrezzature');
      }
      const data = await response.json();
      setEquipments(data);
    } catch (error) {
      console.error('Errore nel caricamento delle attrezzature:', error);
    }
  };
  
  const loadMaintenance = async () => {
    try {
      const response = await fetch(`/api/maintenances/${params.id}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento della manutenzione');
      }
      const data = await response.json();
      setMaintenance(data);
      setFormData({
        title: data.title,
        description: data.description,
        equipmentId: data.equipmentId,
        scheduledDate: data.scheduledDate.split('T')[0], // Solo la data
        priority: data.priority,
        assignedTo: data.assignedTo,
        notes: data.notes
      });
    } catch (error) {
      console.error('Errore nel caricamento della manutenzione:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria';
    }
    
    if (!formData.equipmentId) {
      newErrors.equipmentId = 'Seleziona un\'attrezzatura';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'La data pianificata è obbligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const dataToSend = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };
      
      console.log('Dati inviati al server:', dataToSend);
      
      const response = await fetch(`/api/maintenances/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Risposta server con errore:', responseData);
        throw new Error(responseData.details || responseData.error || 'Errore durante l\'aggiornamento della manutenzione');
      }
      
      console.log('Risposta del server:', responseData);
      
      router.push(`/manutenzioni/${params.id}`);
    } catch (error: any) {
      console.error('Errore completo:', error);
      setErrors({
        submit: error.message || 'Si è verificato un errore durante l\'aggiornamento della manutenzione'
      });
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Modifica Manutenzione</h1>
        <Link 
          href="/manutenzioni" 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
        >
          Torna alla lista
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          {/* ... (JSX per il form di modifica) ... */}
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push(`/manutenzioni/${params.id}`)}
              className="mr-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}