import { Maintenance } from '@/models/maintenances';
import connectDB from '@/lib/db';
import MaintenanceModel from '@/models/maintenances';
import mongoose from 'mongoose';
import { startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, addWeeks, addMonths, addYears } from 'date-fns';
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
    notes: doc.notes,
    maintenanceType: doc.maintenanceType,
    isRecurring: doc.isRecurring,
    frequency: doc.frequency,
    parentMaintenanceId: doc.parentMaintenanceId ? doc.parentMaintenanceId.toString() : undefined
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

  // Verifica che i dati contengano i campi per la ricorrenza
  const maintenanceData = {
    ...data,
    scheduledDate: new Date(data.scheduledDate),
    maintenanceType: data.maintenanceType || 'straordinaria',
    isRecurring: data.isRecurring || false
  };
  
  // Se è ricorrente, assicurati che abbia una frequenza
  if (maintenanceData.isRecurring && !maintenanceData.frequency) {
    throw new Error('Le manutenzioni ricorrenti devono avere una frequenza specificata');
  }
  
  const maintenance = await MaintenanceModel.create(maintenanceData);
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
  
  // Trova la manutenzione da completare
  const maintenance = await MaintenanceModel.findById(id);
  
  if (!maintenance) {
    return null;
  }
  
  // Aggiorna lo stato e la data di completamento
  maintenance.status = 'completata';
  maintenance.completedDate = new Date();
  await maintenance.save();
  
  // Se è una manutenzione ricorrente, genera la prossima
  if (maintenance.isRecurring) {
    await generateNextMaintenance(maintenance);
  }
  
  return mapMaintenanceDoc(maintenance);
}

// Funzione per generare la prossima manutenzione in base alla frequenza
export async function generateNextMaintenance(maintenance: any): Promise<Maintenance | null> {
  if (!maintenance.isRecurring) {
    return null;
  }
  
  const baseDate = maintenance.scheduledDate;
  let nextDate;
  
  // Calcola la prossima data in base alla frequenza
  switch (maintenance.frequency) {
    case 'giornaliera':
      nextDate = addDays(baseDate, 1);
      break;
    case 'settimanale':
      nextDate = addWeeks(baseDate, 1);
      break;
    case 'mensile':
      nextDate = addMonths(baseDate, 1);
      break;
    case 'trimestrale':
      nextDate = addMonths(baseDate, 3);
      break;
    case 'semestrale':
      nextDate = addMonths(baseDate, 6);
      break;
    case 'novemesi':
      nextDate = addMonths(baseDate, 9);
      break;
    case 'annuale':
      nextDate = addYears(baseDate, 1);
      break;
    case 'biennale':
      nextDate = addYears(baseDate, 2);
      break;
    case 'triennale':
      nextDate = addYears(baseDate, 3);
      break;
    default:
      nextDate = addMonths(baseDate, 1); // Default a mensile
  }
  
  // Crea la nuova manutenzione con gli stessi attributi ma data aggiornata
  const newMaintenance = await MaintenanceModel.create({
    title: maintenance.title,
    description: maintenance.description,
    equipmentId: maintenance.equipmentId,
    equipmentName: maintenance.equipmentName,
    scheduledDate: nextDate,
    priority: maintenance.priority,
    status: 'pianificata',
    assignedTo: maintenance.assignedTo,
    notes: maintenance.notes,
    maintenanceType: maintenance.maintenanceType,
    isRecurring: maintenance.isRecurring,
    frequency: maintenance.frequency,
    parentMaintenanceId: maintenance.parentMaintenanceId || maintenance._id // Collega alla manutenzione originale
  });
  
  return mapMaintenanceDoc(newMaintenance);
}

// Funzione per ottenere tutte le manutenzioni collegate alla stessa ricorrenza
export async function getRelatedMaintenances(maintenanceId: string): Promise<Maintenance[]> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(maintenanceId)) {
    return [];
  }
  
  // Trova la manutenzione di riferimento
  const maintenance = await MaintenanceModel.findById(maintenanceId);
  
  if (!maintenance) {
    return [];
  }
  
  // Determina l'ID principale da usare per la ricerca
  const parentId = maintenance.parentMaintenanceId || maintenance._id;
  
  // Trova tutte le manutenzioni correlate (sia quelle con questo ID come parent, sia il parent stesso)
  const relatedMaintenances = await MaintenanceModel.find({
    $or: [
      { _id: parentId },
      { parentMaintenanceId: parentId }
    ]
  }).sort({ scheduledDate: 1 });
  
  return relatedMaintenances.map(mapMaintenanceDoc);
}

// Funzione per calcolare la prossima data di manutenzione in base alla frequenza
export function calculateNextDate(date: Date, frequency: string): Date {
  switch (frequency) {
    case 'giornaliera':
      return addDays(date, 1);
    case 'settimanale':
      return addWeeks(date, 1);
    case 'mensile':
      return addMonths(date, 1);
    case 'trimestrale':
      return addMonths(date, 3);
    case 'semestrale':
      return addMonths(date, 6);
    case 'novemesi':
      return addMonths(date, 9);
    case 'annuale':
      return addYears(date, 1);
    case 'biennale':
      return addYears(date, 2);
    case 'triennale':
      return addYears(date, 3);
    default:
      return addMonths(date, 1); // Default a mensile
  }
}

// Funzione per aggiornare la frequenza di una manutenzione ricorrente e di tutte le future
export async function updateRecurringMaintenanceFrequency(
  id: string, 
  frequency: string, 
  updateFuture: boolean = false
): Promise<Maintenance | null> {
  await connectDB();
  
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  
  const maintenance = await MaintenanceModel.findById(id);
  
  if (!maintenance || !maintenance.isRecurring) {
    return null;
  }
  
  // Aggiorna la frequenza per questa manutenzione
  maintenance.frequency = frequency;
  await maintenance.save();
  
  // Se richiesto, aggiorna anche tutte le manutenzioni future
  if (updateFuture) {
    const parentId = maintenance.parentMaintenanceId || maintenance._id;
    const today = new Date();
    
    // Trova tutte le manutenzioni future con lo stesso parent
    await MaintenanceModel.updateMany(
      {
        $or: [
          { parentMaintenanceId: parentId },
          { _id: parentId }
        ],
        scheduledDate: { $gt: today },
        status: 'pianificata'
      },
      { $set: { frequency } }
    );
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