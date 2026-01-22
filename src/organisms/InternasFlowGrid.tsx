"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { InternalTransferOption } from "@/src/types/transfer";

interface InternasFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const INTERNAL_FLOWS: InternalTransferOption[] = [
  {
    id: "entre-mis-cuentas",
    title: "Entre mis cuentas",
    description: "Mueve dinero entre tus cuentas de ahorro, bolsillos y mas.",
    href: "/transferencias/internas/entre-mis-cuentas",
    enabled: true,
  },
  {
    id: "cuentas-mi-red",
    title: "A cuentas de mi red",
    description: "Transfiere a cuentas de asociados previamente inscritos.",
    href: "/transferencias/internas/cuentas-mi-red",
    enabled: true,
  },
  {
    id: "desde-cupos-rotativos",
    title: "Desde cupos rotativos",
    description: "Utiliza tus cupos de crédito para transferir a tus cuentas.",
    href: "/transferencias/internas/desde-cupos-rotativos",
    enabled: true,
  },
  {
    id: "recargar-pse",
    title: "Recargar con PSE",
    description: "Trae dinero desde otros bancos a tus cuentas Coasmedas.",
    href: "/transferencias/internas/recargar-pse",
    enabled: false,
  },
];

export function InternasFlowGrid({
  onSelectFlow,
  className = "",
}: InternasFlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          Transferencias Internas
        </h2>
        <p className="text-[15px] text-gray-900 text-center">
          Transfiere entre tus productos financieros, a otros asociados de la
          cooperativa o trae dinero desde otros bancos de manera rapida y
          sencilla.
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
    </div>
  );
}
