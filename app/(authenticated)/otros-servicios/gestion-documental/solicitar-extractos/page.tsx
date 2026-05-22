"use client";

import { Breadcrumbs } from "@/src/molecules";
import { SolicitarExtractosCard, SolicitudSuccessModal } from "@/src/organisms";
import { useBrebPageHeader, useUser, useSolicitudFlow } from "@/src/hooks";
import { mockExtractoProducts } from "@/src/mocks";

export default function SolicitarExtractosPage() {
  useBrebPageHeader(
    "Solicitar Extractos",
    "/otros-servicios/gestion-documental",
  );

  const user = useUser();
  const { submitting, modalOpen, submit, closeModal, goToEstado, goBack } =
    useSolicitudFlow();

  const userName = user?.fullName || user?.firstName;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Gestión Documental", "Solicitar Extractos"]}
      />

      <SolicitarExtractosCard
        productOptions={mockExtractoProducts}
        userName={userName}
        submitting={submitting}
        onSubmit={submit}
        onBack={goBack}
      />

      <SolicitudSuccessModal
        isOpen={modalOpen}
        titleId="solicitar-extractos-success-title"
        message="Tu solicitud de extracto ha sido exitosa. Serás notificado una vez tu extracto esté disponible en el módulo de estado de solicitudes."
        onPrimaryAction={goToEstado}
        onSecondaryAction={closeModal}
      />
    </div>
  );
}
