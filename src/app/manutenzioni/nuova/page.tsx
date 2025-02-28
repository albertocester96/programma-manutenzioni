// src/app/manutenzioni/nuova/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Equipment } from '@/models/equipment';
import Link from 'next/link';

export default function CreateMaintenancePage() {
  const router = useRouter();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    equipmentId: '',
    scheduledDate: '',
    priority: 'media' as 'bassa' | 'media' | 'alta',
    assignedTo: '',
    notes: '',
    maintenanceType: 'straordinaria' as 'ordinaria' | 'straordinaria',
    isRecurring: false,
    frequency: 'mensile' as 'giornaliera' | 'settimanale' | 'mensile' | 'trimestrale' | 'semestrale' | 'novemesi' | 'annuale' | 'biennale' | 'triennale'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    loadEquipments();
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
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'maintenanceType') {
      // Se cambio il tipo di manutenzione, aggiorno anche isRecurring
      const typedValue = value as 'ordinaria' | 'straordinaria';
      setFormData({
        ...formData,
        maintenanceType: typedValue,
        isRecurring: value === 'ordinaria'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Rimuovi l'errore quando l'utente inizia a modificare un campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
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
    
    if (formData.isRecurring && !formData.frequency) {
      newErrors.frequency = 'La frequenza è obbligatoria per le manutenzioni ricorrenti';
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
      // Trova il nome dell'attrezzatura selezionata
      const selectedEquipment = equipments.find(eq => eq.id === formData.equipmentId);
      
      const dataToSend = {
        ...formData,
        equipmentName: selectedEquipment?.name || '',
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        status: 'pianificata'
      };
      
      console.log('Dati inviati al server:', dataToSend);
      
      const response = await fetch('/api/maintenances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Risposta server con errore:', responseData);
        throw new Error(responseData.details || responseData.error || 'Errore durante la creazione della manutenzione');
      }
      
      console.log('Risposta del server:', responseData);
      
      router.push('/manutenzioni');
      router.refresh();
    } catch (error: any) {
      console.error('Errore completo:', error);
      setErrors({
        submit: error.message || 'Si è verificato un errore durante la creazione della manutenzione'
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
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nuova Manutenzione</h1>
        <Link 
          href="/manutenzioni" 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
        >
          Torna alla lista
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titolo</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrizione</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">Attrezzatura</label>
              <select
                id="equipmentId"
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.equipmentId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleziona un'attrezzatura</option>
                {equipments.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name} ({equipment.type})
                  </option>
                ))}
              </select>
              {errors.equipmentId && <p className="mt-1 text-sm text-red-500">{errors.equipmentId}</p>}
            </div>
            
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Data Pianificata</label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduledDate && <p className="mt-1 text-sm text-red-500">{errors.scheduledDate}</p>}
            </div>
            
            {/* Nuovo campo per tipo di manutenzione */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di manutenzione</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="maintenanceTypeStr"
                    name="maintenanceType"
                    value="straordinaria"
                    checked={formData.maintenanceType === 'straordinaria'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="maintenanceTypeStr" className="ml-2 block text-sm text-gray-700">
                    Straordinaria
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="maintenanceTypeOrd"
                    name="maintenanceType"
                    value="ordinaria"
                    checked={formData.maintenanceType === 'ordinaria'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="maintenanceTypeOrd" className="ml-2 block text-sm text-gray-700">
                    Ordinaria (Ricorrente)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Campo per la frequenza (visibile solo se è ricorrente) */}
            {formData.isRecurring && (
              <div className="col-span-2">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequenza</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    errors.frequency ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="giornaliera">Giornaliera</option>
                  <option value="settimanale">Settimanale</option>
                  <option value="mensile">Mensile</option>
                  <option value="trimestrale">Trimestrale</option>
                  <option value="semestrale">Semestrale</option>
                  <option value="novemesi">Ogni 9 mesi</option>
                  <option value="annuale">Annuale</option>
                  <option value="biennale">Ogni 2 anni</option>
                  <option value="triennale">Ogni 3 anni</option>
                </select>
                {errors.frequency && <p className="mt-1 text-sm text-red-500">{errors.frequency}</p>}
              </div>
            )}
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priorità</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm p-2 border border-gray-300"
              >
                <option value="bassa">Bassa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assegnato a</label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm p-2 border border-gray-300"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Note</label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm p-2 border border-gray-300"
              ></textarea>
            </div>
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/manutenzioni')}
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