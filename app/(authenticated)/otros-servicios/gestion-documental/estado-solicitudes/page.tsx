"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    // Placeholder for backend call.
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
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Gestión Documental", "Estado de Solicitudes"]}
        />
      </div>

      <EstadoSolicitudesCard
        solicitudes={solicitudes}
        userName={userName}
        onCancelRequest={handleCancelClick}
      />

      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-brand-navy text-[14px] font-medium hover:underline"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Volver
      </button>

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
