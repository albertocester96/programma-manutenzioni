//src/app/api/equipment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEquipmentById, updateEquipment, deleteEquipment } from '@/services/equipment-service';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {

  const params = await context.params;

  try {
    const equipment = await getEquipmentById(params.id);

    if (!equipment) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error(`Errore API equipment/${params.id} GET:`, error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'attrezzatura' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;

  try {
    
    const data = await request.json();
    const equipment = await updateEquipment(params.id, data);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(equipment);
  } catch (error) {
    console.error(`Errore API equipment/${params.id} PUT:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'attrezzatura' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;

  try {
    const success = await deleteEquipment(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Errore API equipment/${params.id} DELETE:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione dell\'attrezzatura' },
      { status: 500 }
    );
  }
}

