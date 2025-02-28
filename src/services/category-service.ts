// src/services/category-service.ts
import connectDB from '@/lib/db';
import CategoryModel, { ICategory } from '@/models/settings';
import mongoose from 'mongoose';

// Funzione per convertire un documento Mongoose in un oggetto Category
const mapCategoryDoc = (doc: any) => ({
  id: doc._id.toString(),
  name: doc.name,
  type: doc.type
});

// Ottenere tutte le categorie di un determinato tipo
export async function getCategoriesByType(type: 'equipment_category' | 'equipment_location'): Promise<{ id: string; name: string }[]> {
  await connectDB();
  
  const categories = await CategoryModel.find({ type }).sort({ name: 1 });
  
  return categories.map(mapCategoryDoc);
}

// Creare una nuova categoria
export async function createCategory(
  name: string, 
  type: 'equipment_category' | 'equipment_location'
): Promise<{ id: string; name: string }> {
  await connectDB();
  
  // Converti il nome in minuscolo per la ricerca case-insensitive
  const normalizedName = name.trim().toLowerCase();
  
  // Controlla se esiste già una categoria con questo nome
  const existingCategory = await CategoryModel.findOne({ 
    name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
    type 
  });
  
  if (existingCategory) {
    throw new Error(`Una categoria "${name}" esiste già per questo tipo`);
  }
  
  const category = await CategoryModel.create({ 
    name: name.trim(), 
    type 
  });
  
  return mapCategoryDoc(category);
}

// Eliminare una categoria
export async function deleteCategory(id: string): Promise<boolean> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  
  const result = await CategoryModel.deleteOne({ _id: id });
  
  return result.deletedCount === 1;
}

// Aggiornare una categoria
export async function updateCategory(
  id: string, 
  newName: string
): Promise<{ id: string; name: string } | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

    // Converti il nome in minuscolo per la ricerca case-insensitive
    const normalizedName = newName.trim().toLowerCase();
  
    // Controlla se esiste già una categoria con questo nome (escludendo l'attuale)
    const existingCategory = await CategoryModel.findOne({ 
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') },
    });
    
    if (existingCategory) {
      throw new Error(`Una categoria "${newName}" esiste già`);
    }
  
  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name: newName.trim() },
    { new: true }
  );
  
  if (!category) {
    return null;
  }
  
  return mapCategoryDoc(category);
}