"use client";

import { FlowOptionCard } from "@/src/molecules";

interface ScheduleTransferSelectionCardProps {
  onSelectOption: (option: "nuevo" | "historial") => void;
}

export function ScheduleTransferSelectionCard({
  onSelectOption,
}: ScheduleTransferSelectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[24px] font-medium text-brand-navy mb-2 text-center">
          Programación de Pagos y Transferencias
        </h2>
        <p className="text-[15px] text-gray-900 text-center">
          Programa tus pagos y transferencias para que se ejecuten
          automáticamente en las fechas que elijas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FlowOptionCard
          title="Programa Nuevo Pago/Transferencia"
          description="Crea una nueva programación para tus pagos o transferencias"
          onClick={() => onSelectOption("nuevo")}
          icon={
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="19" stroke="#005066" strokeWidth="2" />
              <path
                d="M20 12V28M12 20H28"
                stroke="#005066"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <FlowOptionCard
          title="Ver Pagos Programados"
          description="Consulta, edita o elimina tus programaciones existentes."
          onClick={() => onSelectOption("historial")}
        />
      </div>
    </div>
  );
}
