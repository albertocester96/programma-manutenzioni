// src/components/ElectronLink.tsx
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';

interface ElectronLinkProps {
  href: string;
  className?: string;
}

export default function ElectronLink({ href, children, className }: PropsWithChildren<ElectronLinkProps>) {
  // Usa Next/Link normalmente, ma assicurati che gestisca bene la navigazione
  return (
    <NextLink href={href} scroll={false} className={className}>
      {children}
    </NextLink>
  );
}