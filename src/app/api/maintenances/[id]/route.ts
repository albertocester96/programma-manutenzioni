import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceById, updateMaintenance, deleteMaintenance } from '@/services/maintenance-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maintenance = await getMaintenanceById(params.id);
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error(`Errore API maintenance/${params.id} GET:`, error);
    return NextResponse.json(
      { error: 'Errore durante il recupero della manutenzione' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const maintenance = await updateMaintenance(params.id, data);
    
    if (!maintenance) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error(`Errore API maintenance/${params.id} PUT:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento della manutenzione' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteMaintenance(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Manutenzione non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Errore API maintenance/${params.id} DELETE:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della manutenzione' },
      { status: 500 }
    );
  }
}