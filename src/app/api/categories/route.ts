// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getCategoriesByType, 
  createCategory, 
  deleteCategory, 
  updateCategory 
} from '@/services/category-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'equipment_category' | 'equipment_location' | null;
    
    if (!type) {
      return NextResponse.json(
        { error: 'Specificare il tipo di categoria' },
        { status: 400 }
      );
    }
    
    const categories = await getCategoriesByType(type);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Errore API categories GET:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle categorie' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type } = await request.json();
    
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nome e tipo sono obbligatori' },
        { status: 400 }
      );
    }
    
    const category = await createCategory(name, type);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Errore API categories POST:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante la creazione della categoria',
        details: error.message || 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID categoria obbligatorio' },
        { status: 400 }
      );
    }
    
    const success = await deleteCategory(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore API categories DELETE:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della categoria' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e nome sono obbligatori' },
        { status: 400 }
      );
    }
    
    const category = await updateCategory(id, name);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Errore API categories PUT:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante l\'aggiornamento della categoria',
        details: error.message || 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}