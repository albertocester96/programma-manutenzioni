'use client';

import { Equipment } from '@/models/equipment';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface EquipmentListProps {
  equipments: Equipment[];
  onDelete: (id: string) => void;
}

export default function EquipmentList({ equipments, onDelete }: EquipmentListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nome</th>
            <th className="py-3 px-6 text-left">Numero Seriale</th>
            <th className="py-3 px-6 text-left">Categoria</th>
            <th className="py-3 px-6 text-left">Ubicazione</th>
            <th className="py-3 px-6 text-left">Ultima Manutenzione</th>
            <th className="py-3 px-6 text-center">Azioni</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {equipments.map((equipment) => (
            <tr key={equipment.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-6 text-left">{equipment.name}</td>
              <td className="py-3 px-6 text-left">{equipment.serialNumber}</td>
              <td className="py-3 px-6 text-left">{equipment.category}</td>
              <td className="py-3 px-6 text-left">{equipment.location}</td>
              <td className="py-3 px-6 text-left">
                {equipment.lastMaintenance 
                  ? formatDate(equipment.lastMaintenance)
                  : 'Nessuna'}
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <Link href={`/attrezzature/${equipment.id}`}>
                    <div className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </Link>
                  <Link href={`/attrezzature/modifica/${equipment.id}`}>
                    <div className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </Link>
                  <div onClick={() => onDelete(equipment.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}