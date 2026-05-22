"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import {
  EstadoSolicitudesCard,
  CancelSolicitudConfirmModal,
  CancelSolicitudResultModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import { mockSolicitudes } from "@/src/mocks";
import type { SolicitudDocumento } from "@/src/types";

export default function EstadoSolicitudesPage() {
  useBrebPageHeader(
    "Estado de Solicitudes",
    "/otros-servicios/gestion-documental",
  );

  const router = useRouter();
  const user = useUser();
  const userName = user?.fullName || user?.firstName;

  const [solicitudes, setSolicitudes] =
    useState<SolicitudDocumento[]>(mockSolicitudes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const handleCancelClick = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (selectedId) {
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === selectedId ? { ...s, status: "cancelada" } : s,
        ),
      );
    }
    setResultOpen(true);
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleResultClose = () => {
    setResultOpen(false);
    setSelectedId(null);
  };

  const handleBack = () => {
    router.push("/otros-servicios/gestion-documental");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Gestión Documental", "Estado de Solicitudes"]}
      />

      <EstadoSolicitudesCard
        solicitudes={solicitudes}
        userName={userName}
        onCancelRequest={handleCancelClick}
      />

      <BackButton onClick={handleBack} />

      <CancelSolicitudConfirmModal
        isOpen={confirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleConfirmCancel}
      />

      <CancelSolicitudResultModal
        isOpen={resultOpen}
        onClose={handleResultClose}
      />
    </div>
  );
}
