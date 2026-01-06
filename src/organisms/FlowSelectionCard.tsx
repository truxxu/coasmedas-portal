"use client";

import { FlowOptionCard } from "@/src/molecules";

interface FlowSelectionCardProps {
  onSelectInscribir: () => void;
  onSelectPagar: () => void;
}

export function FlowSelectionCard({
  onSelectInscribir,
  onSelectPagar,
}: FlowSelectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="space-y-3 mb-8">
        <h2 className="text-[21px] font-bold text-brand-navy text-center">
          Pago de Servicios Publicos
        </h2>
        <p className="text-[15px] text-gray-900 text-center">
          ¿Que deseas hacer hoy?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <FlowOptionCard
          title="Inscribir Servicios"
          description="Inscribe tus facturas para pagarlas facilmente."
          onClick={onSelectInscribir}
        />
        <FlowOptionCard
          title="Pagar Servicios"
          description="Realiza el pago de tus facturas inscritas."
          onClick={onSelectPagar}
        />
      </div>
    </div>
  );
}
