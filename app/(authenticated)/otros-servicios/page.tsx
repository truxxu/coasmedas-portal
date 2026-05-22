"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { FlowGrid } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { OTROS_SERVICIOS_FLOWS } from "@/src/constants/otrosServicios";
import type { OtrosServiciosOption } from "@/src/types";

export default function OtrosServiciosPage() {
  useBrebPageHeader("Otros Servicios", "/home");
  const router = useRouter();

  const handleSelect = (option: OtrosServiciosOption) => {
    router.push(option.href);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Otros Servicios"]} />

      <FlowGrid
        title="Otros Servicios"
        subtitle="Gestiona aspectos importantes de tu cuenta, seguridad y productos desde un solo lugar."
        options={OTROS_SERVICIOS_FLOWS}
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        onSelect={handleSelect}
      />
    </div>
  );
}
