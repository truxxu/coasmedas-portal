"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { FlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { SEGURIDAD_FLOWS } from "@/src/constants/otrosServicios";
import type { OtrosServiciosOption } from "@/src/types";

export default function SeguridadPage() {
  useBrebPageHeader("Seguridad", "/otros-servicios");
  const router = useRouter();

  const handleSelect = (option: OtrosServiciosOption) => {
    router.push(option.href);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Otros Servicios", "Seguridad"]} />

      <FlowGrid
        title="Módulo de Seguridad"
        subtitle="Gestiona la seguridad de tus productos y el acceso a tu portal."
        options={SEGURIDAD_FLOWS}
        onSelect={handleSelect}
      />
    </div>
  );
}
