"use client";

import { useRef } from "react";
import { Button, SuccessIcon } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";
import type { ProductSecurityAction } from "@/src/types";

interface ProductSecurityConfirmModalProps {
  isOpen: boolean;
  action: ProductSecurityAction;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProductSecurityConfirmModal({
  isOpen,
  action,
  onConfirm,
  onCancel,
}: ProductSecurityConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onCancel,
    containerRef: modalRef,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen) return null;

  const title = action === "block" ? "Confirmar Bloquear" : "Confirmar Activar";
  const message =
    action === "block"
      ? "¿Estás seguro que quieres bloquear este producto o servicio?"
      : "¿Estás seguro que quieres activar este producto o servicio?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-security-confirm-title"
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
          id="product-security-confirm-title"
          className="text-xl font-bold text-brand-navy mb-3"
        >
          {title}
        </h2>

        <p className="text-sm text-[#374151] mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1 h-10 bg-brand-gray-low hover:bg-brand-gray-medium text-brand-text-black"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="flex-1 h-10 bg-brand-primary hover:opacity-90 text-white"
          >
            Sí, continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
