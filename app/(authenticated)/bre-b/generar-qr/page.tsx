"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { GenerarQrCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";

export default function BrebGenerateQrPage() {
  const router = useRouter();
  useBrebPageHeader("Generar QR", "/bre-b");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Generar QR"]} />
      </div>

      <GenerarQrCard />

      <div className="flex justify-start items-center">
        <button
          onClick={() => router.push("/bre-b")}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
