"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface CancelSolicitudConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelSolicitudConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: CancelSolicitudConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onCancel,
    containerRef: modalRef,
    initialFocusRef: confirmButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-solicitud-confirm-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
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
          id="cancel-solicitud-confirm-title"
          className="text-xl font-bold text-brand-navy mb-3"
        >
          Cancelar Solicitud
        </h2>

        <p className="text-sm text-brand-text-black mb-6">
          ¿Estás seguro de cancelar la solicitud?
        </p>

        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="flex-1"
          >
            Sí, continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
