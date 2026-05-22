"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface CancelSolicitudResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CancelSolicitudResultModal({
  isOpen,
  onClose,
}: CancelSolicitudResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose,
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-solicitud-result-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="flex justify-center mb-4">
          <SuccessIcon size="md" />
        </div>

        <h2
          id="cancel-solicitud-result-title"
          className="text-xl font-bold text-brand-navy mb-3"
        >
          Solicitud Cancelada
        </h2>

        <p className="text-sm text-brand-text-black mb-6">
          Tu solicitud de documento ha sido cancelada.
        </p>

        <div className="flex justify-center">
          <Button
            ref={closeButtonRef}
            type="button"
            variant="primary"
            onClick={onClose}
            className="px-10"
          >
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
