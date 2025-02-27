'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">ManutenzioniApp</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/manutenzioni" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/manutenzioni') ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500'
                }`}
              >
                Manutenzioni
              </Link>
              <Link 
                href="/attrezzature" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/attrezzature') ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500'
                }`}
              >
                Attrezzature
              </Link>
              <Link 
                href="/archivio" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/archivio') ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-500'
                }`}
              >
                Archivio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}