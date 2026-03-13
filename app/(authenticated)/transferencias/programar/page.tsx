"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { ScheduleTransferSelectionCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function ProgramarTransferenciasPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Programar Transferencias",
      backHref: "/transferencias",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectOption = (option: "nuevo" | "historial") => {
    if (option === "nuevo") {
      router.push("/transferencias/programar/nuevo");
    } else {
      router.push("/transferencias/programar/historial");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Programar Transferencias"]}
        />
      </div>

      {/* Selection Card */}
      <ScheduleTransferSelectionCard onSelectOption={handleSelectOption} />
    </div>
  );
}
