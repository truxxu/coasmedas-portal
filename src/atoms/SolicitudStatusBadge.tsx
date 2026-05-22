import type { SolicitudStatus } from "@/src/types";

interface SolicitudStatusBadgeProps {
  status: SolicitudStatus;
  className?: string;
}

const statusConfig: Record<
  SolicitudStatus,
  { bg: string; text: string; label: string }
> = {
  solicitado: {
    bg: "bg-brand-yellow/30",
    text: "text-brand-navy-deep",
    label: "Solicitado",
  },
  en_proceso: {
    bg: "bg-brand-info-border",
    text: "text-brand-navy-blue",
    label: "En proceso",
  },
  exitoso: {
    bg: "bg-brand-green/25",
    text: "text-brand-positive",
    label: "Exitoso",
  },
  cancelada: {
    bg: "bg-brand-pink-red",
    text: "text-white",
    label: "Cancelada",
  },
};

export function SolicitudStatusBadge({
  status,
  className = "",
}: SolicitudStatusBadgeProps) {
  const { bg, text, label } = statusConfig[status];
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium ${bg} ${text} ${className}`}
    >
      {label}
    </span>
  );
}
