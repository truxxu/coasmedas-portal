"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";
import type { ProductSecurityAction } from "./ProductSecurityConfirmModal";

interface ProductSecurityResultModalProps {
  isOpen: boolean;
  action: ProductSecurityAction;
  onClose: () => void;
}

export function ProductSecurityResultModal({
  isOpen,
  action,
  onClose,
}: ProductSecurityResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose,
    containerRef: modalRef,
    initialFocusRef: primaryButtonRef,
  });

  if (!isOpen) return null;

  const title = action === "block" ? "Bloqueo Exitoso" : "Activación Exitosa";
  const message =
    action === "block"
      ? "Tu producto ha sido bloqueado exitosamente. Recuerda que para utilizar nuevamente tu producto o servicio debes desbloquearlo."
      : "Tu producto ha sido activado exitosamente. Ya puedes utilizarlo normalmente.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-security-result-title"
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
          id="product-security-result-title"
          className="text-xl font-bold text-brand-navy mb-3"
        >
          {title}
        </h2>

        <p className="text-sm text-[#374151] mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-center">
          <Button
            ref={primaryButtonRef}
            type="button"
            variant="primary"
            onClick={onClose}
            className="px-8 h-10 bg-[#00B8ED] hover:opacity-90 text-white"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}
