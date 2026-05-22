"use client";

import { SolicitudStatusBadge } from "@/src/atoms";
import type { SolicitudDocumento } from "@/src/types";

interface SolicitudListItemProps {
  solicitud: SolicitudDocumento;
  onCancel: (id: string) => void;
  onDownload?: (id: string) => void;
  onEmail?: (id: string) => void;
  isLast?: boolean;
}

export function SolicitudListItem({
  solicitud,
  onCancel,
  onDownload,
  onEmail,
  isLast = false,
}: SolicitudListItemProps) {
  const { id, title, requestedAt, status } = solicitud;
  const canCancel = status === "solicitado" || status === "en_proceso";
  const isExitoso = status === "exitoso";

  return (
    <div
      className={`flex items-start justify-between gap-4 py-5 ${
        isLast ? "" : "border-b border-brand-gray-low"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-medium text-black">{title}</p>
        <p className="text-[14px] text-brand-gray-muted mt-1">
          Solicitado: {requestedAt}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {status !== "cancelada" && <SolicitudStatusBadge status={status} />}

        {isExitoso ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onDownload?.(id)}
              aria-label="Descargar documento"
              className="p-1 text-brand-navy hover:opacity-70"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 13L10 3M10 13L6 9M10 13L14 9M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onEmail?.(id)}
              aria-label="Enviar por correo"
              className="p-1 text-brand-navy hover:opacity-70"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2.5"
                  y="4.5"
                  width="15"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 5L10 11L17 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : canCancel ? (
          <button
            type="button"
            onClick={() => onCancel(id)}
            className="text-brand-danger-text text-[13px] font-medium hover:underline"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </div>
  );
}
