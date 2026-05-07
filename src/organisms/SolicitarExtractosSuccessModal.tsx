"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface SolicitarExtractosSuccessModalProps {
  isOpen: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

export function SolicitarExtractosSuccessModal({
  isOpen,
  onPrimaryAction,
  onSecondaryAction,
}: SolicitarExtractosSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onSecondaryAction,
    containerRef: modalRef,
    initialFocusRef: primaryButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solicitar-extractos-success-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onSecondaryAction}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="flex justify-center mb-4">
          <SuccessIcon size="lg" />
        </div>

        <h2
          id="solicitar-extractos-success-title"
          className="text-xl font-bold text-brand-navy mb-3"
        >
          ¡Solicitud Exitosa!
        </h2>

        <p className="text-sm text-brand-gray-high mb-6 leading-[18px]">
          Tu solicitud de certificado de producto ha sido exitosa. Recuerda que
          para acceder al documento, la clave es tu número de identificación.
          Serás notificado una vez tu certificado esté disponible en el módulo
          de estado de solicitudes.
        </p>

        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            ref={primaryButtonRef}
            type="button"
            variant="primary"
            onClick={onPrimaryAction}
            className="py-6 flex-1"
          >
            Ver Estado de Solicitudes
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onSecondaryAction}
            className="py-6 flex-1"
          >
            Solicitar Otro
          </Button>
        </div>
      </div>
    </div>
  );
}
