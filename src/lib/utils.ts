// Utility generiche per l'applicazione

// Formatta una data ISO in formato leggibile italiano
export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  // Formatta una data ISO includendo anche l'ora
  export function formatDateTime(isoString: string): string {
    return new Date(isoString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Verifica se due date sono lo stesso giorno
  export function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  
  // Raggruppa le manutenzioni per data
  export function groupMaintenancesByDate(maintenances: any[]) {
    const groups: Record<string, any[]> = {};
    
    maintenances.forEach(maintenance => {
      const date = new Date(maintenance.scheduledDate);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(maintenance);
    });
    
    return Object.entries(groups).map(([date, items]) => ({
      date,
      formattedDate: formatDate(date),
      items
    })).sort((a, b) => a.date.localeCompare(b.date));
  }