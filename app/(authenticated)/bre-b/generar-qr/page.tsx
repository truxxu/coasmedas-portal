"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { GenerarQrCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function BrebGenerateQrPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Generar QR",
      backHref: "/bre-b",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

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
