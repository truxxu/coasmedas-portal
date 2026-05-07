"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import {
  SolicitarExtractosCard,
  SolicitarExtractosSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import { mockExtractoProducts } from "@/src/mocks";
import type { SolicitarExtractosFormData } from "@/src/schemas/solicitarExtractosSchema";

export default function SolicitarExtractosPage() {
  useBrebPageHeader(
    "Solicitar Extractos",
    "/otros-servicios/gestion-documental",
  );

  const router = useRouter();
  const user = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (_data: SolicitarExtractosFormData) => {
    // TODO: replace with real backend call once endpoint is available.
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setModalOpen(true);
  };

  const handleVerEstado = () => {
    setModalOpen(false);
    router.push("/otros-servicios/gestion-documental/estado-solicitudes");
  };

  const handleSolicitarOtro = () => {
    setModalOpen(false);
  };

  const handleBack = () => {
    router.push("/otros-servicios/gestion-documental");
  };

  const userName = user?.fullName || user?.firstName;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Gestión Documental", "Solicitar Extractos"]}
        />
      </div>

      <SolicitarExtractosCard
        productOptions={mockExtractoProducts}
        userName={userName}
        submitting={submitting}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      <SolicitarExtractosSuccessModal
        isOpen={modalOpen}
        onPrimaryAction={handleVerEstado}
        onSecondaryAction={handleSolicitarOtro}
      />
    </div>
  );
}
