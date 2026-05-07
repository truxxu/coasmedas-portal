"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import {
  CertificadosTributariosCard,
  CertificadosTributariosSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import {
  CERTIFICADO_TRIBUTARIO_OPTIONS,
  CERTIFICADO_TRIBUTARIO_ANIOS,
} from "@/src/constants/certificadosTributarios";
import type { CertificadosTributariosFormData } from "@/src/schemas/certificadosTributariosSchema";

export default function CertificadosTributariosPage() {
  useBrebPageHeader(
    "Certificados Tributarios",
    "/otros-servicios/gestion-documental",
  );

  const router = useRouter();
  const user = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (_data: CertificadosTributariosFormData) => {
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
          items={["Inicio", "Gestión Documental", "Certificados Tributarios"]}
        />
      </div>

      <CertificadosTributariosCard
        tipoOptions={CERTIFICADO_TRIBUTARIO_OPTIONS}
        anioOptions={CERTIFICADO_TRIBUTARIO_ANIOS}
        userName={userName}
        submitting={submitting}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      <CertificadosTributariosSuccessModal
        isOpen={modalOpen}
        onPrimaryAction={handleVerEstado}
        onSecondaryAction={handleSolicitarOtro}
      />
    </div>
  );
}
