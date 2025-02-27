'use client';

import { Maintenance } from '@/models/maintenances';
import { formatDate } from '@/lib/utils';

interface MaintenanceCardProps {
  maintenance: Maintenance;
  onComplete: (id: string) => void;
  onArchive?: (id: string) => void;
}

export default function MaintenanceCard({ 
  maintenance, 
  onComplete,
  onArchive
}: MaintenanceCardProps) {
  const priorityColor = {
    'bassa': 'bg-green-100 text-green-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'alta': 'bg-red-100 text-red-800'
  }[maintenance.priority];

  const statusColor = {
    'pianificata': 'bg-blue-100 text-blue-800',
    'in corso': 'bg-purple-100 text-purple-800',
    'completata': 'bg-green-100 text-green-800',
    'archiviata': 'bg-gray-100 text-gray-800'
  }[maintenance.status];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{maintenance.title}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
            {maintenance.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {maintenance.status}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mt-2">{maintenance.description}</p>
      
      <div className="mt-3 text-sm text-gray-500">
        <p><span className="font-medium">Attrezzatura:</span> {maintenance.equipmentName}</p>
        <p><span className="font-medium">Data pianificata:</span> {formatDate(maintenance.scheduledDate)}</p>
        {maintenance.assignedTo && <p><span className="font-medium">Assegnato a:</span> {maintenance.assignedTo}</p>}
      </div>
      
      {maintenance.status !== 'completata' && maintenance.status !== 'archiviata' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onComplete(maintenance.id)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            Completa
          </button>
        </div>
      )}
      
      {maintenance.status === 'completata' && onArchive && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onArchive(maintenance.id)}
            className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
          >
            Archivia
          </button>
        </div>
      )}
    </div>
  );
}