"use client";

import { Breadcrumbs } from "@/src/molecules";
import {
  CertificadosProductosCard,
  SolicitudSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader, useUser, useSolicitudFlow } from "@/src/hooks";
import { CERTIFICADO_PRODUCTO_OPTIONS } from "@/src/constants/certificadosProductos";

export default function CertificadosProductosPage() {
  useBrebPageHeader(
    "Certificados de Producto",
    "/otros-servicios/gestion-documental",
  );

  const user = useUser();
  const { submitting, modalOpen, submit, closeModal, goToEstado, goBack } =
    useSolicitudFlow();

  const userName = user?.fullName || user?.firstName;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Gestión Documental", "Certificados de Productos"]}
      />

      <CertificadosProductosCard
        productoOptions={CERTIFICADO_PRODUCTO_OPTIONS}
        userName={userName}
        submitting={submitting}
        onSubmit={submit}
        onBack={goBack}
      />

      <SolicitudSuccessModal
        isOpen={modalOpen}
        titleId="certificados-productos-success-title"
        message="Tu solicitud de certificado de producto ha sido exitosa. Recuerda que para acceder al documento, la clave es tu número de identificación. Serás notificado una vez tu certificado esté disponible en el módulo de estado de solicitudes."
        onPrimaryAction={goToEstado}
        onSecondaryAction={closeModal}
      />
    </div>
  );
}
