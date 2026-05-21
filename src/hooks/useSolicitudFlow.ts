"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADO_SOLICITUDES_HREF =
  "/otros-servicios/gestion-documental/estado-solicitudes";
const GESTION_DOCUMENTAL_HREF = "/otros-servicios/gestion-documental";

interface UseSolicitudFlowResult {
  submitting: boolean;
  modalOpen: boolean;
  submit: () => Promise<void>;
  closeModal: () => void;
  goToEstado: () => void;
  goBack: () => void;
}

export function useSolicitudFlow(): UseSolicitudFlowResult {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goToEstado = () => {
    setModalOpen(false);
    router.push(ESTADO_SOLICITUDES_HREF);
  };

  const goBack = () => {
    router.push(GESTION_DOCUMENTAL_HREF);
  };

  return { submitting, modalOpen, submit, closeModal, goToEstado, goBack };
}
