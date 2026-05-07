"use client";

import { Breadcrumbs } from "@/src/molecules";
import { OtrosServiciosFlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";

export default function OtrosServiciosPage() {
  useBrebPageHeader("Otros Servicios", "/home");

  const handleSelectFlow = (_flowId: string) => {
    // Sub-flows will be wired in upcoming tasks.
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Otros Servicios"]} />
      </div>

      <OtrosServiciosFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
