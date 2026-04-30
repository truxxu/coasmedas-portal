"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { BrebOption } from "@/src/types";

interface BrebFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const BREB_FLOWS: BrebOption[] = [
  {
    id: "pagar-transferir-llave",
    title: "Pagar o Transferir con Llave",
    description:
      "Usa un número de celular, email, documento u otra llave para enviar dinero.",
    href: "/bre-b/pagar-transferir-llave",
    enabled: true,
  },
  {
    id: "pagar-qr",
    title: "Pagar con Código QR",
    description:
      "Escanea un código para pagar o generar el tuyo para recibir dinero.",
    href: "/bre-b/pagar-qr",
    enabled: true,
  },
  {
    id: "gestionar-llaves",
    title: "Gestionar mis llaves",
    description:
      "Administrar tus llaves para recibir dinero: regístralas, modifícalas o bloquéalas.",
    href: "/bre-b/gestionar-llaves",
    enabled: false,
  },
  {
    id: "historial",
    title: "Historia de Transacciones",
    description:
      "Consulta tus últimos movimientos y solicita devoluciones si es necesario.",
    href: "/bre-b/historial",
    enabled: false,
  },
];

export function BrebFlowGrid({
  onSelectFlow,
  className = "",
}: BrebFlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          Zona Bre-B
        </h2>
        <p className="text-[15px] text-gray-900 text-center">
          Realiza pagos y transferencias inmediatas de forma segura y sencilla.
          Administra tus llaves y consulta tu historial de transacciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BREB_FLOWS.map((flow) => (
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
