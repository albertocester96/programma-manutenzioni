// src/services/api-service.ts
export interface ApiOptions extends RequestInit {
    // Estendi con le tue opzioni personalizzate
  }
  
  export async function fetchWithOfflineSupport<T>(url: string, options: ApiOptions = {}): Promise<T | null> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: T = await response.json();
      return data;
    } catch (error) {
      // Gestisci il caso offline
      console.error('Network error:', error);
      // Recupera i dati dalla cache locale se disponibile
      return null;
    }
  }