"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { OtrosServiciosOption } from "@/src/types";

interface OtrosServiciosFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const OTROS_SERVICIOS_FLOWS: OtrosServiciosOption[] = [
  {
    id: "gestion-documental",
    title: "Gestión Documental",
    description:
      "Consulta y descarga certificados y otros documentos importantes.",
    href: "/otros-servicios/gestion-documental",
    enabled: true,
  },
  {
    id: "seguridad",
    title: "Seguridad",
    description:
      "Cambia tu clave, gestiona tus dispositivos y revisa la actividad de tu cuenta.",
    href: "/otros-servicios/seguridad",
    enabled: true,
  },
  {
    id: "administracion-productos",
    title: "Administración de Productos",
    description: "Activa, bloquea o cancela tus productos financieros.",
    href: "/otros-servicios/administracion-productos",
    enabled: true,
  },
  {
    id: "datos-personales",
    title: "Datos Personales",
    description: "Actualiza tu información de contacto y dirección.",
    href: "/otros-servicios/datos-personales",
    enabled: true,
  },
];

export function OtrosServiciosFlowGrid({
  onSelectFlow,
  className = "",
}: OtrosServiciosFlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          Otros Servicios
        </h2>
        <p className="text-[15px] text-brand-text-black text-center">
          Gestiona aspectos importantes de tu cuenta, seguridad y productos
          desde un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {OTROS_SERVICIOS_FLOWS.map((flow) => (
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
