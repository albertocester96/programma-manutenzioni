import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Maintenance from '@/models/maintenances';

export async function PATCH(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  // Ottieni l'ID dalla richiesta prima di altre operazioni
  const id = context.params.id;

  try {
    // Connetti al database
    await connectDB();

    // Trova e aggiorna la manutenzione
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id, 
      { 
        status: 'completata', 
        completedDate: new Date(),
        completedBy: 'Sistema' // Potresti voler passare l'utente attuale
      }, 
      { new: true } // Restituisce il documento aggiornato
    );

    if (!updatedMaintenance) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' }, 
        { status: 404 }
      );
    }

    // Converti il documento in un oggetto plain
    const formattedMaintenance = {
      ...updatedMaintenance.toObject(),
      id: updatedMaintenance._id.toString(),
      _id: undefined,
      scheduledDate: updatedMaintenance.scheduledDate.toISOString(),
      completedDate: updatedMaintenance.completedDate.toISOString(),
      createdAt: updatedMaintenance.createdAt.toISOString(),
      updatedAt: updatedMaintenance.updatedAt.toISOString()
    };

    return NextResponse.json(formattedMaintenance, { status: 200 });
  } catch (error) {
    console.error('Errore durante il completamento della manutenzione:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante il completamento della manutenzione', 
        details: error instanceof Error ? error.message : 'Errore sconosciuto' 
      }, 
      { status: 500 }
    );
  }
}