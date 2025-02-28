'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Equipment } from '@/models/equipment';
import Link from 'next/link';

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    location: '',
    purchaseDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    loadEquipment();
  }, [id]);
  
  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/equipment/${id}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento dell\'attrezzatura');
      }
      const data = await response.json();
      setEquipment(data);
      
      // Formatta la data nel formato richiesto dall'input type="date"
      const purchaseDate = data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '';
      
      setFormData({
        name: data.name,
        type: data.type,
        category: data.category,
        location: data.location,
        purchaseDate: purchaseDate,
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Errore nel caricamento dell\'attrezzatura:', error);
      setErrors({
        submit: 'Si è verificato un errore durante il caricamento dell\'attrezzatura'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Rimuovi l'errore quando l'utente inizia a modificare un campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'La tipologia / modello è obbligatorio';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'La categoria è obbligatoria';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'L\'ubicazione è obbligatoria';
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
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : undefined
      };
      
      console.log('Dati inviati per aggiornamento:', dataToSend);
      
      const response = await fetch(`/api/equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Risposta server con errore:', responseData);
        throw new Error(responseData.details || responseData.error || 'Errore durante l\'aggiornamento dell\'attrezzatura');
      }
      
      console.log('Attrezzatura aggiornata con successo:', responseData);
      
      router.push('/attrezzature');
      router.refresh();
    } catch (error: any) {
      console.error('Errore nell\'aggiornamento dell\'attrezzatura:', error);
      setErrors({
        submit: error.message || 'Si è verificato un errore durante l\'aggiornamento dell\'attrezzatura'
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
  
  if (!equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Attrezzatura non trovata
        </div>
        <div className="mt-4">
          <Link 
            href="/attrezzature" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Torna alla lista
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Modifica Attrezzatura</h1>
        <Link 
          href="/attrezzature" 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
        >
          Torna alla lista
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700"> Tipologia / Modello </label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicazione</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Data di Acquisto</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm p-2 border border-gray-300"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Note</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
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
              onClick={() => router.push('/attrezzature')}
              className="mr-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}