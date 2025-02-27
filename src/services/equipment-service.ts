// src/services/equipment-service.ts
import { Equipment } from '@/models/equipment';
import connectDB from '@/lib/db';
import EquipmentModel from '@/models/equipment';
import mongoose from 'mongoose';

// Funzione per convertire un documento Mongoose in un oggetto Equipment
const mapEquipmentDoc = (doc: any): Equipment => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    serialNumber: doc.serialNumber,
    category: doc.category,
    location: doc.location,
    purchaseDate: doc.purchaseDate ? doc.purchaseDate.toISOString() : undefined,
    lastMaintenance: doc.lastMaintenance ? doc.lastMaintenance.toISOString() : undefined,
    notes: doc.notes,
    status: doc.status,
  };
};

// Funzione per ottenere tutte le attrezzature
export async function getAllEquipments(): Promise<Equipment[]> {
  await connectDB();
  
  const equipments = await EquipmentModel.find().sort({ name: 1 });
  
  return equipments.map(mapEquipmentDoc);
}

// Funzione per ottenere un'attrezzatura tramite ID
export async function getEquipmentById(id: string): Promise<Equipment | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const equipment = await EquipmentModel.findById(id);
  
  if (!equipment) {
    return null;
  }
  
  return mapEquipmentDoc(equipment);
}

// Funzione per creare una nuova attrezzatura
export async function createEquipment(data: Omit<Equipment, 'id'>): Promise<Equipment> {
  await connectDB();
  
  // Prepara i dati, convertendo le date
  const createData: any = { ...data };
  if (data.purchaseDate) {
    createData.purchaseDate = new Date(data.purchaseDate);
  }
  if (data.lastMaintenance) {
    createData.lastMaintenance = new Date(data.lastMaintenance);
  }
  
  const equipment = await EquipmentModel.create(createData);
  
  return mapEquipmentDoc(equipment);
}

// Funzione per aggiornare un'attrezzatura
export async function updateEquipment(id: string, data: Partial<Equipment>): Promise<Equipment | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  // Prepara i dati per l'aggiornamento, convertendo le date
  const updateData: any = { ...data };
  if (data.purchaseDate) {
    updateData.purchaseDate = new Date(data.purchaseDate);
  }
  if (data.lastMaintenance) {
    updateData.lastMaintenance = new Date(data.lastMaintenance);
  }
  
  const equipment = await EquipmentModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
  
  if (!equipment) {
    return null;
  }
  
  return mapEquipmentDoc(equipment);
}

// Funzione per eliminare un'attrezzatura
export async function deleteEquipment(id: string): Promise<boolean> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  
  const result = await EquipmentModel.deleteOne({ _id: id });
  
  return result.deletedCount === 1;
}

// Funzione per aggiornare la data dell'ultima manutenzione
export async function updateLastMaintenance(id: string, date: Date): Promise<Equipment | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const equipment = await EquipmentModel.findByIdAndUpdate(
    id,
    { $set: { lastMaintenance: date } },
    { new: true }
  );
  
  if (!equipment) {
    return null;
  }
  
  return mapEquipmentDoc(equipment);
}