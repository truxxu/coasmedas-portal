"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { DatosPersonalesCard } from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import { mockDatosPersonalesData } from "@/src/mocks";

export default function DatosPersonalesPage() {
  useBrebPageHeader("Datos Personales", "/otros-servicios");
  const router = useRouter();
  const { user } = useUser();

  const firstName =
    user?.firstName?.split(" ")[0] ??
    mockDatosPersonalesData.infoBasica.fullName.split(" ")[0];

  const handleCancel = () => {
    router.push("/otros-servicios");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Otros Servicios", "Datos Personales"]} />
      <DatosPersonalesCard
        firstName={firstName}
        defaultValues={mockDatosPersonalesData}
        onCancel={handleCancel}
      />
    </div>
  );
}
