"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { ScheduledTransfersTable } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { mockScheduledTransfers } from "@/src/mocks";
import type { ScheduledTransfer } from "@/src/types/scheduledTransfer";

export default function HistorialProgramacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [transfers, setTransfers] = useState<ScheduledTransfer[]>(
    mockScheduledTransfers,
  );

  useEffect(() => {
    setWelcomeBar({
      title: "Historial",
      backHref: "/transferencias/programar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleDelete = (transferId: string) => {
    const transfer = transfers.find((t) => t.id === transferId);
    if (!transfer) return;

    const confirmed = window.confirm(
      `¿Está seguro de eliminar la programación a ${transfer.destination}?`,
    );
    if (confirmed) {
      setTransfers((prev) => prev.filter((t) => t.id !== transferId));
    }
  };

  const handleExportPDF = () => {
    console.log("Exportar PDF");
  };

  const handleExportExcel = () => {
    console.log("Exportar Excel");
  };

  const handleBack = () => {
    router.push("/transferencias/programar");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Programación", "Historial"]} />
      </div>

      {/* Table */}
      <ScheduledTransfersTable
        transfers={transfers}
        hideBalances={hideBalances}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
