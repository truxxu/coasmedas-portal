"use client";

import { Card } from "@/src/atoms";
import { SolicitudListItem } from "@/src/molecules";
import type { SolicitudDocumento } from "@/src/types";

interface EstadoSolicitudesCardProps {
  solicitudes: SolicitudDocumento[];
  userName?: string;
  onCancelRequest: (id: string) => void;
  onDownload?: (id: string) => void;
  onEmail?: (id: string) => void;
}

export function EstadoSolicitudesCard({
  solicitudes,
  userName,
  onCancelRequest,
  onDownload,
  onEmail,
}: EstadoSolicitudesCardProps) {
  return (
    <Card className="p-6 md:p-8">
      <div className="mb-2">
        <h2 className="text-[22px] font-bold text-brand-navy">
          Estado de Solicitudes
        </h2>
        <p className="text-[14px] text-brand-text-black mt-1">
          {userName
            ? `Hola ${userName}, consulta el estado de tus solicitudes de documentos.`
            : "Consulta el estado de tus solicitudes de documentos."}
        </p>
      </div>

      <div className="mt-4">
        {solicitudes.length === 0 ? (
          <p className="text-[14px] text-brand-gray-muted py-8 text-center">
            No tienes solicitudes registradas.
          </p>
        ) : (
          solicitudes.map((solicitud, index) => (
            <SolicitudListItem
              key={solicitud.id}
              solicitud={solicitud}
              onCancel={onCancelRequest}
              onDownload={onDownload}
              onEmail={onEmail}
              isLast={index === solicitudes.length - 1}
            />
          ))
        )}
      </div>
    </Card>
  );
}
