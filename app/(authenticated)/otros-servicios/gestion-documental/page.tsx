"use client";

import { Breadcrumbs } from "@/src/molecules";
import { GestionDocumentalFlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";

export default function GestionDocumentalPage() {
  useBrebPageHeader("Gestión Documental", "/otros-servicios");

  const handleSelectFlow = (_flowId: string) => {
    // Sub-flows will be wired in upcoming tasks.
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Otros Servicios", "Gestión Documental"]}
        />
      </div>

      <GestionDocumentalFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
