// src/models/equipment.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ReactNode } from 'react';


// Definizione dell'interfaccia TypeScript per il documento
export interface IEquipment extends Document {
  name: string;
  serialNumber: string;
  category: string;
  location: string;
  purchaseDate?: Date;
  lastMaintenance?: Date;
  notes?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo per il passaggio di dati nella UI
export type Equipment = {
  status: ReactNode;
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  location: string;
  purchaseDate?: string;
  lastMaintenance?: string;
  notes?: string;
  
}

// Schema Mongoose
const EquipmentSchema = new Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  purchaseDate: { type: Date },
  lastMaintenance: { type: Date },
  notes: { type: String },
  status: { type: String, required: true}
}, { 
  timestamps: true 
});

// Esportazione del modello (con verifica se è già stato compilato)
export default mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);