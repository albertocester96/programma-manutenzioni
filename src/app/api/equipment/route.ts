import { NextRequest, NextResponse } from 'next/server';
import { getAllEquipments, createEquipment } from '@/services/equipment-service';

export async function GET() {
  try {
    const equipments = await getAllEquipments();
    return NextResponse.json(equipments);
  } catch (error) {
    console.error('Errore API equipment GET:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle attrezzature' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const equipment = await createEquipment(data);
    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error('Errore API equipment POST:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'attrezzatura' },
      { status: 500 }
    );
  }
}