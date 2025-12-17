"use client";

import { useSession } from "@/src/hooks";

function formatDateTime(date: Date): string {
  return (
    date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

export function SessionFooter() {
  const session = useSession();

  if (!session) return null;

  return (
    <footer className="bg-brand-light-blue border-t border-brand-border px-4 py-2 lg:px-8 lg:py-0 lg:h-8 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 text-xs text-[#B1B1B1]">
      <span>Último ingreso: {formatDateTime(session.lastLogin)}</span>
      <span>IP: {session.ipAddress}</span>
    </footer>
  );
}
