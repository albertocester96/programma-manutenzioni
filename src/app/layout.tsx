import "./globals.css";

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from "@/components/navigation/navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gestione Manutenzioni',
  description: 'Applicazione per la gestione delle manutenzioni ordinarie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

