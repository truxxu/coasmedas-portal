"use client";

import { useRef } from "react";
import { Button } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface BrebReversalConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BrebReversalConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: BrebReversalConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onCancel,
    containerRef: modalRef,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breb-reversal-confirm-title"
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
        <h2
          id="breb-reversal-confirm-title"
          className="text-[20px] font-bold text-brand-navy-blue mb-3"
        >
          Confirmar Reversión
        </h2>
        <p className="text-[15px] text-black mb-6">
          Esta acción puede tardar unos minutos y depende de la confirmación de
          la contraparte. ¿Deseas continuar?
        </p>

        <div className="flex gap-3">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1 h-10 bg-brand-border hover:bg-brand-gray-low text-brand-text-black"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
          >
            Sí, continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
