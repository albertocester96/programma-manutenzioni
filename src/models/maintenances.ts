// src/models/maintenances.ts
import mongoose, { Schema, Document } from 'mongoose';

// Tipo per il passaggio di dati nella UI
export type Maintenance = {
  id: string;
  title: string;
  description: string;
  equipmentId: string;
  equipmentName: string;
  scheduledDate: string;
  priority: 'bassa' | 'media' | 'alta';
  status: 'pianificata' | 'in corso' | 'completata' | 'archiviata';
  assignedTo?: string;
  completedDate?: string;
  completedBy?: string;
  notes?: string;
}

// Definizione dell'interfaccia TypeScript per il documento
export interface IMaintenance extends Document {
  title: string;
  description: string;
  equipmentId: mongoose.Types.ObjectId;
  equipmentName: string;
  scheduledDate: Date;
  priority: 'bassa' | 'media' | 'alta';
  status: 'pianificata' | 'in corso' | 'completata' | 'archiviata';
  assignedTo?: string;
  completedDate?: Date;
  completedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema Mongoose
const MaintenanceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  equipmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment', 
    required: true 
  },
  equipmentName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  priority: { 
    type: String, 
    enum: ['bassa', 'media', 'alta'], 
    default: 'media' 
  },
  status: { 
    type: String, 
    enum: ['pianificata', 'in corso', 'completata', 'archiviata'], 
    default: 'pianificata' 
  },
  assignedTo: { type: String },
  completedDate: { type: Date },
  completedBy: { type: String },
  notes: { type: String }
}, { 
  timestamps: true 
});

// Esportazione del modello (con verifica se è già stato compilato)
const MaintenanceModel = mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);

export default MaintenanceModel;