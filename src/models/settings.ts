// src/models/settings.ts
import mongoose, { Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'equipment_category' | 'equipment_location'| 'staff_role';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['equipment_category', 'equipment_location']
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);