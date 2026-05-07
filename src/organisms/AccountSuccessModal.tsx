"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface AccountSuccessModalProps {
  isOpen: boolean;
  type: "register" | "edit";
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

export function AccountSuccessModal({
  isOpen,
  type,
  onPrimaryAction,
  onSecondaryAction,
}: AccountSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onPrimaryAction,
    containerRef: modalRef,
    initialFocusRef: primaryButtonRef,
  });

  if (!isOpen) return null;

  const title =
    type === "register"
      ? "Cuenta Inscrita con Exito"
      : "Cuenta Editada con Exito";
  const message =
    type === "register"
      ? "Su cuenta externa ha sido inscrita con exito. Por favor revise en su lista de cuentas inscritas."
      : "Su cuenta externa ha sido editada con exito. Por favor revise en su lista de cuentas inscritas.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onPrimaryAction}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <SuccessIcon size="lg" />
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-xl font-bold text-brand-navy-blue mb-3"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-brand-gray-high mb-6">{message}</p>

        {/* Actions */}
        {type === "register" ? (
          <div className="flex gap-3">
            {onSecondaryAction && (
              <Button
                type="button"
                variant="secondary"
                onClick={onSecondaryAction}
                className="flex-1 h-10 bg-brand-border hover:bg-brand-gray-low text-brand-text-black"
              >
                Cancelar
              </Button>
            )}
            <Button
              ref={primaryButtonRef}
              type="button"
              variant="primary"
              onClick={onPrimaryAction}
              className="flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
            >
              Volver a Inicio
            </Button>
          </div>
        ) : (
          <Button
            ref={primaryButtonRef}
            type="button"
            variant="primary"
            onClick={onPrimaryAction}
            className="w-full h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
          >
            Aceptar
          </Button>
        )}
      </div>
    </div>
  );
}
