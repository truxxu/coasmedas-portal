"use client";

import { Breadcrumbs } from "@/src/molecules";
import {
  CertificadosTributariosCard,
  SolicitudSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser, useSolicitudFlow } from "@/src/hooks";
import {
  CERTIFICADO_TRIBUTARIO_OPTIONS,
  CERTIFICADO_TRIBUTARIO_ANIOS,
} from "@/src/constants/certificadosTributarios";

export default function CertificadosTributariosPage() {
  useBrebPageHeader(
    "Certificados Tributarios",
    "/otros-servicios/gestion-documental",
  );

  const user = useUser();
  const { submitting, modalOpen, submit, closeModal, goToEstado, goBack } =
    useSolicitudFlow();

  const userName = user?.fullName || user?.firstName;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Gestión Documental", "Certificados Tributarios"]}
      />

      <CertificadosTributariosCard
        tipoOptions={CERTIFICADO_TRIBUTARIO_OPTIONS}
        anioOptions={CERTIFICADO_TRIBUTARIO_ANIOS}
        userName={userName}
        submitting={submitting}
        onSubmit={submit}
        onBack={goBack}
      />

      <SolicitudSuccessModal
        isOpen={modalOpen}
        titleId="certificados-tributarios-success-title"
        message="Tu solicitud de certificado tributario ha sido exitosa. Recuerda que para acceder al documento, la clave es tu número de identificación. Serás notificado una vez tu certificado esté disponible en el módulo de estado de solicitudes."
        onPrimaryAction={goToEstado}
        onSecondaryAction={closeModal}
      />
    </div>
  );
}
