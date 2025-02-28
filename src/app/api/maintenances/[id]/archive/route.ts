import { NextRequest, NextResponse } from 'next/server';
import { archiveMaintenance } from '@/services/maintenance-service';

export async function PATCH(
  request: NextRequest,
  { params }: {params: Promise<{ id: string}> }
) {
  const id = (await params).id;
  try {
   
    const maintenance = await archiveMaintenance(id);
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error(`Errore API maintenance/${id}/archive PATCH:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'archiviazione della manutenzione' },
      { status: 500 }
    );
  }
}