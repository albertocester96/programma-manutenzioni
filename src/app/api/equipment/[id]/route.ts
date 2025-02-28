import { NextRequest, NextResponse } from 'next/server';
import { getEquipmentById, updateEquipment, deleteEquipment } from '@/services/equipment-service';

// Define a custom type for params
type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const id = (await params).id;
  try {
    const equipment = await getEquipmentById(id);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(equipment);
  } catch (error) {
    console.error(`Errore API equipment/${id} GET:`, error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'attrezzatura' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) { 
  const id = (await params).id;
  try {
   
    const data = await request.json();
    const equipment = await updateEquipment(id, data);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(equipment);
  } catch (error) {
    console.error(`Errore API equipment/${id} PUT:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'attrezzatura' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,  
  { params }: { params: Promise<{ id: string }> }
) {
   const id = (await params).id;
  try {
  
    const success = await deleteEquipment(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Attrezzatura non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Errore API equipment/${id} DELETE:`, error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione dell\'attrezzatura' },
      { status: 500 }
    );
  }
}
