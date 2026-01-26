"use client";

import { useEffect, useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";

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

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the primary button when modal opens
    primaryButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPrimaryAction();
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPrimaryAction]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const title =
    type === "register" ? "Cuenta Inscrita con Exito" : "Cuenta Editada con Exito";
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
          className="text-xl font-bold text-[#1D4E8F] mb-3"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-[#58585B] mb-6">{message}</p>

        {/* Actions */}
        {type === "register" ? (
          <div className="flex gap-3">
            {onSecondaryAction && (
              <Button
                type="button"
                variant="secondary"
                onClick={onSecondaryAction}
                className="flex-1 h-10 bg-[#E4E6EA] hover:bg-[#D1D2D4] text-[#111827]"
              >
                Cancelar
              </Button>
            )}
            <Button
              ref={primaryButtonRef}
              type="button"
              variant="primary"
              onClick={onPrimaryAction}
              className="flex-1 h-10 bg-[#00B8ED] hover:bg-[#00A5D8] text-white"
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
            className="w-full h-10 bg-[#00B8ED] hover:bg-[#00A5D8] text-white"
          >
            Aceptar
          </Button>
        )}
      </div>
    </div>
  );
}
