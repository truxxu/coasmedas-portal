'use client';

import { useSession } from '@/src/hooks';

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function SessionFooter() {
  const session = useSession();

  if (!session) return null;

  return (
    <footer className="h-8 bg-brand-light-blue border-t border-brand-border px-8 flex items-center justify-center gap-8 text-xs text-[#B1B1B1]">
      <span>Último ingreso: {formatDateTime(session.lastLogin)}</span>
      <span>Ingreso actual: {formatDateTime(session.currentLogin)}</span>
      <span>IP: {session.ipAddress}</span>
    </footer>
  );
}
