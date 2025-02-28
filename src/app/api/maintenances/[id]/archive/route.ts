import { NextRequest, NextResponse } from 'next/server';
import { archiveMaintenance } from '@/services/maintenance-service';

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {

  const params = await context.params;
  try {
    const maintenance = await archiveMaintenance(params.id);
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error(`Errore API maintenance/${params.id}/archive PATCH:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'archiviazione della manutenzione' },
      { status: 500 }
    );
  }
}