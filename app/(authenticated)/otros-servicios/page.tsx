"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { OtrosServiciosFlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";

export default function OtrosServiciosPage() {
  useBrebPageHeader("Otros Servicios", "/home");
  const router = useRouter();

  const handleSelectFlow = (flowId: string) => {
    if (flowId === "gestion-documental") {
      router.push("/otros-servicios/gestion-documental");
    }
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
