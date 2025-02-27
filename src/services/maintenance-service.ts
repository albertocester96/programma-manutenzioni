import { Maintenance } from '@/models/maintenances';
import connectDB from '@/lib/db';
import MaintenanceModel from '@/models/maintenances';
import mongoose from 'mongoose';
import { startOfDay, endOfDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';

// Funzione per convertire un documento Mongoose in un oggetto Maintenance
const mapMaintenanceDoc = (doc: any): Maintenance => {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    equipmentId: doc.equipmentId.toString(),
    equipmentName: doc.equipmentName,
    scheduledDate: doc.scheduledDate.toISOString(),
    priority: doc.priority,
    status: doc.status,
    assignedTo: doc.assignedTo,
    completedDate: doc.completedDate ? doc.completedDate.toISOString() : undefined,
    completedBy: doc.completedBy,
    notes: doc.notes
  };
};

// Funzione per ottenere le manutenzioni filtrate per data
export async function getMaintenancesByDateFilter(filter: 'oggi' | 'domani' | 'settimana'): Promise<Maintenance[]> {
  await connectDB();
  
  const now = new Date();
  let startDate, endDate;
  
  switch (filter) {
    case 'oggi':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case 'domani':
      startDate = startOfDay(addDays(now, 1));
      endDate = endOfDay(addDays(now, 1));
      break;
    case 'settimana':
      startDate = startOfWeek(now, { locale: it });
      endDate = endOfWeek(now, { locale: it });
      break;
    default:
      startDate = startOfDay(now);
      endDate = endOfDay(now);
  }
  
  const maintenances = await MaintenanceModel.find({
    scheduledDate: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $in: ['pianificata', 'in corso'] }
  }).sort({ scheduledDate: 1, priority: -1 });
  
  return maintenances.map(mapMaintenanceDoc);
}

// Funzione per ottenere tutte le manutenzioni con filtro opzionale per stato
export async function getAllMaintenances(status?: string): Promise<Maintenance[]> {
  await connectDB();
  
  const query = status ? { status } : {};
  const maintenances = await MaintenanceModel.find(query).sort({ scheduledDate: 1 });
  
  return maintenances.map(mapMaintenanceDoc);
}

// Funzione per ottenere una manutenzione tramite ID
export async function getMaintenanceById(id: string): Promise<Maintenance | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const maintenance = await MaintenanceModel.findById(id);
  
  if (!maintenance) {
    return null;
  }
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per creare una nuova manutenzione
export async function createMaintenance(data: Omit<Maintenance, 'id'>): Promise<Maintenance> {
  await connectDB();
  
  const maintenance = await MaintenanceModel.create({
    ...data,
    scheduledDate: new Date(data.scheduledDate)
  });
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per aggiornare una manutenzione
export async function updateMaintenance(id: string, data: Partial<Maintenance>): Promise<Maintenance | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  // Prepara i dati per l'aggiornamento, convertendo le date
  const updateData: any = { ...data };
  if (data.scheduledDate) {
    updateData.scheduledDate = new Date(data.scheduledDate);
  }
  if (data.completedDate) {
    updateData.completedDate = new Date(data.completedDate);
  }
  
  const maintenance = await MaintenanceModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
  
  if (!maintenance) {
    return null;
  }
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per completare una manutenzione
export async function completeMaintenance(id: string): Promise<Maintenance | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const maintenance = await MaintenanceModel.findByIdAndUpdate(
    id,
    { 
      $set: { 
        status: 'completata', 
        completedDate: new Date() 
      } 
    },
    { new: true }
  );
  
  if (!maintenance) {
    return null;
  }
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per archiviare una manutenzione
export async function archiveMaintenance(id: string): Promise<Maintenance | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const maintenance = await MaintenanceModel.findByIdAndUpdate(
    id,
    { $set: { status: 'archiviata' } },
    { new: true }
  );
  
  if (!maintenance) {
    return null;
  }
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per eliminare una manutenzione
export async function deleteMaintenance(id: string): Promise<boolean> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  
  const result = await MaintenanceModel.deleteOne({ _id: id });
  
  return result.deletedCount === 1;
}

