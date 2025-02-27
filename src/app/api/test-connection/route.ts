import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Verifica lo stato della connessione
    const connectionState = mongoose.connection.readyState;
    const responseData: {
      success: boolean;
      message: string;
      connectionState: number;
      database?: string;
    } = {
      success: connectionState === 1, // 1 = connesso
      message: getConnectionStateMessage(connectionState),
      connectionState
    };
    
    // Aggiungi il nome del database solo se la connessione è stabilita e db esiste
    if (connectionState === 1 && mongoose.connection.db) {
      responseData.database = mongoose.connection.db.databaseName;
    }
    
    return NextResponse.json(responseData, {
      status: responseData.success ? 200 : 500
    });
  } catch (err: unknown) {
    console.error('Errore di connessione:', err);
    
    // Gestisci l'errore in modo sicuro per TypeScript
    let errorMessage = 'Errore sconosciuto';
    
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object') {
      errorMessage = String(err);
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Errore di connessione a MongoDB', 
      error: errorMessage
    }, { status: 500 });
  }
}

// Funzione di utilità per ottenere un messaggio basato sullo stato della connessione
function getConnectionStateMessage(state: number): string {
  switch (state) {
    case 0:
      return 'Disconnesso';
    case 1:
      return 'Connesso';
    case 2:
      return 'Connessione in corso';
    case 3:
      return 'Disconnessione in corso';
    default:
      return 'Stato sconosciuto';
  }
}