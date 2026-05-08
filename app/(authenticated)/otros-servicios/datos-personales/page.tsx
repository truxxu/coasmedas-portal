"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { DatosPersonalesCard } from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import { mockDatosPersonalesData } from "@/src/mocks";
import type { DatosPersonalesFormValues } from "@/src/schemas/datosPersonalesSchema";

const BASE_PATH = "/otros-servicios/datos-personales";
const DRAFT_KEY = "datosPersonalesDraft";

export default function DatosPersonalesPage() {
  useBrebPageHeader("Datos Personales", "/otros-servicios");
  const router = useRouter();
  const { user } = useUser();

  const firstName =
    user?.firstName?.split(" ")[0] ??
    mockDatosPersonalesData.infoBasica.fullName.split(" ")[0];

  const handleSubmit = (data: DatosPersonalesFormValues) => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    router.push(`${BASE_PATH}/codigo-sms`);
  };

  const handleCancel = () => {
    router.push("/otros-servicios");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Otros Servicios", "Datos Personales"]} />
      <DatosPersonalesCard
        firstName={firstName}
        defaultValues={mockDatosPersonalesData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
