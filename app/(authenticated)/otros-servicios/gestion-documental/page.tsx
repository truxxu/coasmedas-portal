"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { FlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { GESTION_DOCUMENTAL_FLOWS } from "@/src/constants/otrosServicios";
import type { OtrosServiciosOption } from "@/src/types";

export default function GestionDocumentalPage() {
  useBrebPageHeader("Gestión Documental", "/otros-servicios");
  const router = useRouter();

  const handleSelect = (option: OtrosServiciosOption) => {
    router.push(option.href);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Otros Servicios", "Gestión Documental"]}
      />

      <FlowGrid
        title="Gestión Documental"
        subtitle="Aquí podrás realizar la solicitud de tus documentos de tus productos con Coasmedas como paz y salvo y certificaciones."
        options={GESTION_DOCUMENTAL_FLOWS}
        onSelect={handleSelect}
      />
    </div>
  );
}
