"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { InternalTransferOption } from "@/src/types/transfer";

interface ExternasFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const INTERNAL_FLOWS: InternalTransferOption[] = [
  {
    id: "inscribir-cuentas",
    title: "Inscribir Cuentas",
    description: "Inscribe, edita o elimina cuentas de destino.",
    href: "/transferencias/externas/entre-mis-cuentas",
    enabled: true,
  },
  {
    id: "otros-bancos",
    title: "A Otros Bancos",
    description: "Transfiere a cuentas de otras entidades financieras.",
    href: "/transferencias/externas/otros-bancos",
    enabled: true,
  },
  {
    id: "red-copcentral",
    title: "Cuentas de mi Red Coopcentral",
    description: "Envía dinero a otras cooperativas de la red.",
    href: "/transferencias/externas/desde-cupos-rotativos",
    enabled: true,
  },
];

export function ExternasFlowGrid({
  onSelectFlow,
  className = "",
}: ExternasFlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          Transferencias Externas
        </h2>
        <p className="text-[15px] text-gray-900 text-center">
          Envía dinero de tus productos Coasmedas a cuentas de otras entidades
          financieras con total seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTERNAL_FLOWS.map((flow) => (
          <FlowOptionCard
            key={flow.id}
            title={flow.title}
            description={flow.description}
            onClick={() => onSelectFlow(flow.id)}
            disabled={!flow.enabled}
          />
        ))}
      </div>
      <div className="mt-6">
        <p className="text-[15px] text-gray-900 text-center">
          Recuerda que el límite para tus transferencias externas se ajusta en
          nuestras oficinas. Las transferencias realizadas después de las 2:00
          p.m. se procesarán al siguiente día hábil.
        </p>
      </div>
    </div>
  );
}
