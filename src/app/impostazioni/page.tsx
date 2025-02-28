// src/app/impostazioni/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Check, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const [categoryTypes] = useState([
    { key: 'equipment_category', label: 'Categorie Attrezzature' },
    { key: 'equipment_location', label: 'Ubicazioni' },
    { key: 'staff_role', label: 'Ruoli Personale' }
  ]);
  const [activeType, setActiveType] = useState('equipment_category');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [activeType]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories?type=${activeType}`);
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle categorie');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName,
          type: activeType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Errore durante la creazione');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Errore:', error);
      alert(error instanceof Error ? error.message : 'Errore durante la creazione');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa categoria?')) return;

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione');
      }

      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editingCategory.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Errore durante l\'aggiornamento');
      }

      const updatedCategory = await response.json();
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
      setEditingCategory(null);
    } catch (error) {
      console.error('Errore:', error);
      alert(error instanceof Error ? error.message : 'Errore durante l\'aggiornamento');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Impostazioni</h1>
      
      <div className="bg-white shadow-md rounded-lg">
        {/* Tipo di categoria */}
        <div className="border-b px-6 py-4">
          <div className="flex space-x-4">
            {categoryTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setActiveType(type.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeType === type.key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista categorie e form di aggiunta */}
        <div className="p-6">
          <div className="flex mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={`Nuova ${categoryTypes.find(t => t.key === activeType)?.label}`}
              className="flex-grow mr-2 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              disabled={!newCategoryName.trim()}
            >
              <Plus size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nessuna categoria presente
            </p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li 
                  key={category.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory, 
                          name: e.target.value
                        })}
                        className="flex-grow mr-2 p-2 border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleEditCategory}
                          className="text-green-600 hover:text-green-800"
                          disabled={!editingCategory.name.trim()}
                        >
                          <Check size={20} />
                        </button>
                        <button 
                          onClick={() => setEditingCategory(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="flex-grow">{category.name}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}