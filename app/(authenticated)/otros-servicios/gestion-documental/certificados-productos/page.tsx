"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import {
  CertificadosProductosCard,
  CertificadosProductosSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser } from "@/src/hooks";
import { CERTIFICADO_PRODUCTO_OPTIONS } from "@/src/constants/certificadosProductos";
import type { CertificadosProductosFormData } from "@/src/schemas/certificadosProductosSchema";

export default function CertificadosProductosPage() {
  useBrebPageHeader(
    "Certificados de Producto",
    "/otros-servicios/gestion-documental",
  );

  const router = useRouter();
  const user = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (_data: CertificadosProductosFormData) => {
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
          items={["Inicio", "Gestión Documental", "Certificados de Productos"]}
        />
      </div>

      <CertificadosProductosCard
        productoOptions={CERTIFICADO_PRODUCTO_OPTIONS}
        userName={userName}
        submitting={submitting}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      <CertificadosProductosSuccessModal
        isOpen={modalOpen}
        onPrimaryAction={handleVerEstado}
        onSecondaryAction={handleSolicitarOtro}
      />
    </div>
  );
}
