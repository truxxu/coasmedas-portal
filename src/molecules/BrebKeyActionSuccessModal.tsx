"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";
import type { BrebKeyAction } from "./BrebKeyActionConfirmModal";

interface BrebKeyActionSuccessModalProps {
  isOpen: boolean;
  action: BrebKeyAction;
  onAccept: () => void;
}

const TITLES: Record<BrebKeyAction, string> = {
  bloquear: "Llave bloqueada con éxito",
  activar: "Llave activada con éxito",
  cancelar: "Llave cancelada con éxito",
};

const MESSAGES: Record<BrebKeyAction, string> = {
  bloquear:
    "La llave fue bloqueada correctamente. No podrá recibir pagos hasta que la active nuevamente.",
  activar: "La llave fue activada correctamente y ya puede recibir pagos.",
  cancelar:
    "La llave fue cancelada correctamente. Si la necesita en el futuro deberá registrarla nuevamente.",
};

export function BrebKeyActionSuccessModal({
  isOpen,
  action,
  onAccept,
}: BrebKeyActionSuccessModalProps) {
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
      aria-labelledby="breb-key-success-title"
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
          id="breb-key-success-title"
          className="text-xl font-bold text-brand-navy-blue mb-3"
        >
          {TITLES[action]}
        </h2>

        <p className="text-sm text-brand-gray-high mb-6">{MESSAGES[action]}</p>

        <Button
          ref={primaryButtonRef}
          type="button"
          variant="primary"
          onClick={onAccept}
          className="w-full h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
}
