"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface BrebReversalSuccessModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function BrebReversalSuccessModal({
  isOpen,
  onAccept,
}: BrebReversalSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onAccept,
    containerRef: modalRef,
    initialFocusRef: primaryButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breb-reversal-success-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onAccept}
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
          id="breb-reversal-success-title"
          className="text-[21px] font-bold text-brand-navy mb-3"
        >
          Operación Exitosa
        </h2>
        <p className="text-[14px] text-brand-gray-high mb-6">
          La reversión fue procesada correctamente.
        </p>
        <Button
          ref={primaryButtonRef}
          type="button"
          variant="primary"
          onClick={onAccept}
          className="h-10 px-7 mx-auto"
        >
          Ver Historial
        </Button>
      </div>
    </div>
  );
}
