import { NextRequest, NextResponse } from 'next/server';
import { getMaintenancesByDateFilter, getAllMaintenances, createMaintenance } from '@/services/maintenance-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') as 'oggi' | 'domani' | 'settimana' | null;
    
    if (filter) {
      const maintenances = await getMaintenancesByDateFilter(filter);
      return NextResponse.json(maintenances);
    } else {
      const status = searchParams.get('status');
      const maintenances = await getAllMaintenances(status || undefined);
      return NextResponse.json(maintenances);
    }
  } catch (error) {
    console.error('Errore API maintenances GET:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle manutenzioni' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Dati ricevuti per la creazione:', data);
    const maintenance = await createMaintenance(data);
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error: any) { // Cast error to any or use a more specific type
    console.error('Errore API maintenances POST:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante la creazione della manutenzione', 
        details: error.message || 'Errore sconosciuto',
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
  