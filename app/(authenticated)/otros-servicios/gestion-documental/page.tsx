"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { GestionDocumentalFlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";

export default function GestionDocumentalPage() {
  useBrebPageHeader("Gestión Documental", "/otros-servicios");
  const router = useRouter();

  const handleSelectFlow = (flowId: string) => {
    if (flowId === "solicitar-extractos") {
      router.push("/otros-servicios/gestion-documental/solicitar-extractos");
    } else if (flowId === "estado-solicitudes") {
      router.push("/otros-servicios/gestion-documental/estado-solicitudes");
    } else if (flowId === "certificados-tributarios") {
      router.push(
        "/otros-servicios/gestion-documental/certificados-tributarios",
      );
    }
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
