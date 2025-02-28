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
    
    // Log dei dati ricevuti con evidenza dei campi di ricorrenza
    console.log('Dati ricevuti per la creazione:', {
      ...data,
      ricorrenza: {
        tipo: data.maintenanceType,
        isRecurring: data.isRecurring,
        frequency: data.frequency,
        parentId: data.parentMaintenanceId
      }
    });
// Validazione per manutenzioni ricorrenti
if (data.isRecurring === true && !data.frequency) {
  throw new Error('Per le manutenzioni ricorrenti è necessario specificare una frequenza');
}

const maintenance = await createMaintenance(data);
return NextResponse.json(maintenance, { status: 201 });
} catch (error: any) {
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