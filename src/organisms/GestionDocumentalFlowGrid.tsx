"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { OtrosServiciosOption } from "@/src/types";

interface GestionDocumentalFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const GESTION_DOCUMENTAL_FLOWS: OtrosServiciosOption[] = [
  {
    id: "solicitar-extractos",
    title: "Solicitar Extractos",
    description: "Pide los extractos de tus productos por período.",
    href: "/otros-servicios/gestion-documental/solicitar-extractos",
    enabled: true,
  },
  {
    id: "certificados-tributarios",
    title: "Certificados Tributarios",
    description: "Solicita certificados de retención, etc.",
    href: "/otros-servicios/gestion-documental/certificados-tributarios",
    enabled: true,
  },
  {
    id: "certificados-productos",
    title: "Certificados de Productos",
    description: "Obtén certificaciones de tus productos financieros.",
    href: "/otros-servicios/gestion-documental/certificados-productos",
    enabled: true,
  },
  {
    id: "estado-solicitudes",
    title: "Estado de Solicitudes",
    description: "Consulta, descarga y gestiona tus solicitudes.",
    href: "/otros-servicios/gestion-documental/estado-solicitudes",
    enabled: true,
  },
];

export function GestionDocumentalFlowGrid({
  onSelectFlow,
  className = "",
}: GestionDocumentalFlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          Gestión Documental
        </h2>
        <p className="text-[15px] text-brand-text-black text-center">
          Aquí podrás realizar la solicitud de tus documentos de tus productos
          con Coasmedas como paz y salvo y certificaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GESTION_DOCUMENTAL_FLOWS.map((flow) => (
          <FlowOptionCard
            key={flow.id}
            title={flow.title}
            description={flow.description}
            onClick={() => onSelectFlow(flow.id)}
            disabled={!flow.enabled}
          />
        ))}
      </div>
    </div>
  );
}

export { GESTION_DOCUMENTAL_FLOWS };
